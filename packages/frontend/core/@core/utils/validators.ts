import { isEmpty, isEmptyArray, isNullOrUndefined } from "./helpers";

// 👉 Required Validator
export const requiredValidator = (value: unknown) => {
  if (isNullOrUndefined(value) || isEmptyArray(value) || value === false)
    return "This field is required";

  return !!String(value).trim().length || "This field is required";
};

// 👉 Email Validator
export const emailValidator = (value: unknown) => {
  if (isEmpty(value)) return true;

  const re =
    /^(?:[^<>()[\]\\.,;:\s@"]+(?:\.[^<>()[\]\\.,;:\s@"]+)*|".+")@(?:\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]|(?:[a-z\-\d]+\.)+[a-z]{2,})$/i;

  if (Array.isArray(value))
    return (
      value.every((val) => re.test(String(val))) ||
      "The Email field must be a valid email"
    );

  return re.test(String(value)) || "The Email field must be a valid email";
};

// 👉 Password Validator
export const passwordValidator = (password: string) => {
  const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/;

  const validPassword = regExp.test(password);

  return (
    validPassword ||
    "Field must contain at least one uppercase, lowercase, special character and digit with min 8 chars"
  );
};

// 👉 Confirm Password Validator
export const confirmedValidator = (value: string, target: string) =>
  value === target || "The Confirm Password field confirmation does not match";

// 👉 Between Validator
export const betweenValidator = (value: unknown, min: number, max: number) => {
  const valueAsNumber = Number(value);

  return (
    (Number(min) <= valueAsNumber && Number(max) >= valueAsNumber) ||
    `Enter number between ${min} and ${max}`
  );
};

// 👉 min number Validator
export const minNumValidator = (value: unknown, min: number) => {
  const valueAsNumber = Number(value);

  return Number(min) <= valueAsNumber || `Enter number greater than ${min}`;
};

// 👉 min number Validator
export const maxNumValidator = (value: unknown, max: number) => {
  const valueAsNumber = Number(value);

  return Number(max) >= valueAsNumber || `Enter number smaller than ${max}`;
};

// 👉 Integer Validator
export const integerValidator = (value: unknown) => {
  if (isEmpty(value)) return true;

  if (Array.isArray(value))
    return (
      value.every((val) => /^-?\d+$/.test(String(val))) ||
      "This field must be an integer"
    );

  return /^-?\d+$/.test(String(value)) || "This field must be an integer";
};

// 👉 Regex Validator
export const regexValidator = (
  value: unknown,
  regex: RegExp | string,
): string | boolean => {
  if (isEmpty(value)) return true;

  let regeX = regex;
  if (typeof regeX === "string") regeX = new RegExp(regeX);

  if (Array.isArray(value))
    return value.every((val) => regexValidator(val, regeX));

  return regeX.test(String(value)) || "The Regex field format is invalid";
};

// 👉 Alpha Validator
export const alphaValidator = (value: unknown) => {
  if (isEmpty(value)) return true;

  return (
    /^[A-Z]*$/i.test(String(value)) ||
    "The Alpha field may only contain alphabetic characters"
  );
};

// 👉 URL Validator
export const urlValidator = (value: unknown) => {
  if (isEmpty(value)) return true;

  const re = /^https?:\/\/[^\s$.?#].\S*$/;

  return re.test(String(value)) || "URL is invalid";
};

// 👉 Length Validator
export const lengthValidator = (value: unknown, length: number) => {
  if (isEmpty(value)) return true;

  return (
    String(value).length === length ||
    `"The length of the Characters field must be ${length} characters."`
  );
};

// 👉 Min Length Validator
export const minLengthValidator = (value: unknown, length: number) => {
  if (isEmpty(value)) return true;

  return (
    String(value).length < length ||
    `"The length of the Characters field must be greater than ${length} characters."`
  );
};

// 👉 Max Length Validator
export const maxLengthValidator = (value: unknown, length: number) => {
  if (isEmpty(value)) return true;

  return (
    String(value).length > length ||
    `"The length of the Characters field must be less than ${length} characters."`
  );
};

// 👉 Alpha-dash Validator
export const alphaDashValidator = (value: unknown) => {
  if (isEmpty(value)) return true;

  const valueAsString = String(value);

  return /^[\w-]*$/.test(valueAsString) || "All Character are not valid";
};

// 👉 Required if Validator
export const requiredIfValidator = (value: unknown, otherValue: string) => {
  if (
    !isNullOrUndefined(otherValue) ||
    !isEmptyArray(otherValue) ||
    otherValue !== false
  )
    return "This field is required";

  return !!String(otherValue).trim().length || "This field is required";
};

// 👉 Max Length Validator
export const uniqueValidator = async (
  value: unknown,
  url: string,
  field: string,
  filedValue: string,
  skip?: string,
) => {
  if (isEmpty(value)) return true;

  if (skip && skip === value) {
    return true;
  }

  try {
    const res = await $fetch<IResType<any>>(url, {
      params: {
        field: field,
        value: value,
      },
    });
    if (res.success == true) {
      return true;
    } else {
      return "Field is not unique";
    }
  } catch (error: any) {
    return "Field is not unique";
  }
};

// 👉 Alpha-dash Validator
export const slugValidator = (value: unknown) => {
  if (isEmpty(value)) return true;

  const valueAsString = String(value);

  if (["*", "?", "@", "!", "$", "%", "^", "&", "*"].includes(valueAsString)) {
    return "Not  a valid slug";
  }

  return (
    /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/\d{4}\s(0\d|1\d|2[0-3]):([0-5]\d)$/.test(
      valueAsString,
    ) || "Slug is not valid"
  );
};

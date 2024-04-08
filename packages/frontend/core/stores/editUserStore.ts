import { defineStore } from "pinia";
import { date } from "quasar";
import {
  JobDepartmentApi,
  JobIndustryApi,
  LanguageApi,
} from "@/utils/BaseApiService";
import { ref } from "vue";
import { userApi } from "~/utils/api/UserApi";

const editUserStore = defineStore("editUser", () => {
  const user = ref<null | Record<string, any>>(null);
  const { formatDate } = date;
  const userForm = ref({
    image: null,
    user: {
      firstName: "",
      lastName: "",
      email: "",
      userName: "",
      password: "",
      password_confirmaton: "",
      phone: "",
      desc: "",
      isActive: false,
      isPublic: false,
    },
  });

  const addressForm = ref({
    address: {
      address: "",
      continentId: "",
      countryId: "",
      stateId: "",
      cityId: "",
      streetId: "",
      zip: "",
    },
  });

  const socialForm = ref({
    social: {
      website: "",
      facebook: "",
      twitter: "",
      instagram: "",
      pintrest: "",
      linkedin: "",
      vk: "",
      whatsapp: "",
      telegram: "",
    },
  });

  const favoriteLinksForm = ref({
    favoriteLinks: [{ link: "" }],
  });

  const workExperienceForm = ref({
    workExperience: [
      {
        jobIndustryId: "",
        jobFunction: "",
        jobTitle: "",
        jobDepartmentId: "",
        companyName: "",
        companySize: "",
        cityId: "",
        stateId: "",
        countryId: "",
        zip: "",
        startDate: "",
        endDate: "",
        desc: "",
        isCurrent: false,
      },
    ],
  });

  const educationForm = ref({
    education: [
      {
        institute: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        desc: "",
      },
    ],
  });

  const languagesForm = ref({
    languages: [],
  });

  const skillsForm = ref({
    skills: [
      {
        name: "",
        desc: "",
      },
    ],
  });

  const notificationForm = ref({
    NotificationSettings: {
      onMessageRecieve: true,
      onCommentReply: true,
      onProductUpdate: true,
      onOffers: true,
    },
  });

  const passwordForm = ref({
    password: "",
    password_confirmation: "",
  });

  const jobDepartments = ref([]);
  const jobIndustry = ref([]);
  const languages = ref([]);

  const addNewFavoriteLinks = () => {
    favoriteLinksForm.value.favoriteLinks.push({
      link: "",
    });
  };

  const popFavoriteLinks = () => {
    favoriteLinksForm.value.favoriteLinks.pop();
  };

  const addNewWorkExperience = () => {
    workExperienceForm.value.workExperience.push({
      jobIndustryId: "",
      jobFunction: "",
      jobTitle: "",
      jobDepartmentId: "",
      companyName: "",
      companySize: "",
      cityId: "",
      stateId: "",
      countryId: "",
      zip: "",
      startDate: "",
      endDate: "",
      desc: "",
      isCurrent: false,
    });
  };

  const popWorkExperience = (index: number) => {
    workExperienceForm.value.workExperience.splice(index, 1);
  };

  const addNewEducation = () => {
    educationForm.value.education.push({
      institute: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      desc: "",
    });
  };

  const popEducation = (index: number) => {
    educationForm.value.education.splice(index, 1);
  };

  const addNewSkill = () => {
    skillsForm.value.skills.push({
      name: "",
      desc: "",
    });
  };

  const popSkill = (index: number) => {
    skillsForm.value.skills.splice(index, 1);
  };

  const getJobDepartments = async () => {
    await JobDepartmentApi.index().then(({ data }) => {
      jobDepartments.value = (data.value as any).map((d: any) => ({
        label: d.name,
        value: d.id,
      }));
    });
  };

  const getJobIndustry = async () => {
    await JobIndustryApi.index().then(({ data }) => {
      jobIndustry.value = (data.value as any).map((d: any) => ({
        label: d.name,
        value: d.id,
      }));
    });
  };

  const getLangauges = async () => {
    await LanguageApi.index().then(({ data }) => {
      languages.value = data.value as any;
    });
  };

  // const submitForm = () => {
  //   const { execute, loading } = userApi.put();
  //   return {
  //     execute,
  //     loading,
  //   };
  // };

  const getInitialValues = async (id: string) => {
    return userApi.show(id, {
      populate: {
        address: {
          fields: ["*"],
        },
        social: {
          fields: ["*"],
        },
        favoriteLinks: {
          fields: ["*"],
        },
        experiences: {
          fields: ["*"],
          populate: {
            department: {
              fields: ["name", "id"],
            },
            industry: {
              fields: ["name", "id"],
            },
            country: {
              fields: ["name", "id"],
            },
            state: {
              fields: ["name", "id"],
            },
            city: {
              fields: ["name", "id"],
            },
          },
        },
        educations: {
          fields: ["*"],
        },
        NotificationSetting: {
          fields: ["*"],
        },
        skills: {
          fields: ["*"],
        },
        languages: {
          fields: ["*"],
        },
      },
    });
  };

  const setInitialValues = (data: any) => {
    user.value = data.value;
    userForm.value.user.firstName = (data.value as any)?.first_name;
    userForm.value.user.lastName = (data.value as any)?.last_name;
    userForm.value.user.email = (data.value as any)?.email;
    userForm.value.user.userName = (data.value as any)?.user_name;
    userForm.value.user.phone = (data.value as any)?.phone;
    userForm.value.user.desc = (data.value as any)?.desc;
    userForm.value.user.isActive =
      (data.value as any)?.is_active == 1 ? true : false;
    userForm.value.user.isPublic =
      (data.value as any)?.is_public == 1 ? true : false;

    addressForm.value.address.address =
      (data.value as any)?.address?.address || "";
    addressForm.value.address.continentId =
      (data.value as any)?.address?.continent_id || "";
    addressForm.value.address.countryId =
      (data.value as any)?.address?.country_id || "";
    addressForm.value.address.stateId =
      (data.value as any)?.address?.state_id || "";
    addressForm.value.address.cityId =
      (data.value as any)?.address?.city_id || "";
    addressForm.value.address.streetId =
      (data.value as any)?.address?.street_id || "";
    addressForm.value.address.zip = (data.value as any)?.address?.zip || "";

    socialForm.value.social.website =
      (data.value as any)?.social?.website || "";
    socialForm.value.social.facebook =
      (data.value as any)?.social?.facebook || "";
    socialForm.value.social.twitter =
      (data.value as any)?.social?.twitter || "";
    socialForm.value.social.instagram =
      (data.value as any)?.social?.instagram || "";
    socialForm.value.social.pintrest =
      (data.value as any)?.social?.pintrest || "";
    socialForm.value.social.linkedin =
      (data.value as any)?.social?.linkedin || "";
    socialForm.value.social.vk = (data.value as any)?.social?.vk || "";
    socialForm.value.social.whatsapp =
      (data.value as any)?.social?.whatsapp || "";
    socialForm.value.social.telegram =
      (data.value as any)?.social?.telegram || "";

    favoriteLinksForm.value.favoriteLinks = (data.value as any)
      ?.favoriteLinks || [{ link: "" }];

    const newExperienceData = (data.value as any)?.experiences.map(
      (e: any) => ({
        cityId: e?.city_id || "",
        companyName: e?.company_name || "",
        companySize: e?.company_szie || "",
        countryId: e?.country_id || "",
        desc: e?.desc || "",
        endDate: e?.end_date ? formatDate(e?.end_date, "DD/MM/YYYY") : "",
        isCurrent: e?.is_current == 1 ? true : false,
        jobDepartmentId: e?.job_department_id || "",
        jobFunction: e?.job_function || "",
        jobIndustryId: e?.job_industry_id || "",
        jobTitle: e?.job_title || "",
        startDate: e?.start_date ? formatDate(e?.start_date, "DD/MM/YYYY") : "",
        stateId: e?.state_id || "",
        zip: e?.zip || "",
      })
    );

    workExperienceForm.value.workExperience = newExperienceData;

    console.log(workExperienceForm.value);

    if ((data.value as any)?.languages) {
      languagesForm.value.languages = (data.value as any)?.languages.map(
        (l) => l.id
      );
    }

    if ((data.value as any)?.skills) {
      skillsForm.value.skills = (data.value as any)?.skills.map((s: any) => ({
        name: s.name,
        desc: s.desc,
      }));
    }

    if ((data.value as any)?.NotificationSetting) {
      notificationForm.value.NotificationSettings.onCommentReply =
        (data.value as any)?.NotificationSetting.on_comment_reply == 1
          ? true
          : false;

      notificationForm.value.NotificationSettings.onMessageRecieve =
        (data.value as any)?.NotificationSetting.on_message_recieve == 1
          ? true
          : false;

      notificationForm.value.NotificationSettings.onOffers =
        (data.value as any)?.NotificationSetting.on_offers == 1 ? true : false;

      notificationForm.value.NotificationSettings.onProductUpdate =
        (data.value as any)?.NotificationSetting.on_product_update == 1
          ? true
          : false;
    }
  };
  return {
    user,
    userForm,
    addressForm,
    socialForm,
    favoriteLinksForm,
    skillsForm,
    workExperienceForm,
    educationForm,
    languagesForm,
    notificationForm,
    passwordForm,
    // submitForm,
    addNewFavoriteLinks,
    addNewWorkExperience,
    addNewEducation,
    popEducation,
    popFavoriteLinks,
    popWorkExperience,
    getJobDepartments,
    jobDepartments,
    getJobIndustry,
    jobIndustry,
    getLangauges,
    languages,
    addNewSkill,
    popSkill,
    getInitialValues,
    setInitialValues,
  };
});

export default editUserStore;

import { defineStore } from "pinia";
import {
  JobDepartmentApi,
  JobIndustryApi,
  LanguageApi,
} from "@/utils/BaseApiService";
import { ref } from "vue";
// import { userApi } from "~/utils/api/UserApi";

const createUserStore = defineStore("createUser", () => {
  const initialForm = {
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
    address: {
      address: "",
      continentId: "",
      countryId: "",
      stateId: "",
      cityId: "",
      streetId: "",
      zip: "",
    },
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
    favoriteLinks: [{ link: "" }],
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
    languages: [],
    skills: [
      {
        name: "",
        desc: "",
      },
    ],
    NotificationSettings: {
      onMessageRecieve: true,
      onCommentReply: true,
      onProductUpdate: true,
      onOffers: true,
    },
  };
  const form = ref(initialForm);

  const jobDepartments = ref([]);
  const jobIndustry = ref([]);
  const languages = ref([]);

  const addNewFavoriteLinks = () => {
    form.value.favoriteLinks.push({
      link: "",
    });
  };

  const popFavoriteLinks = () => {
    form.value.favoriteLinks.pop();
  };

  const addNewWorkExperience = () => {
    form.value.workExperience.push({
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

  const popWorkExperience = () => {
    form.value.workExperience.pop();
  };

  const addNewEducation = () => {
    form.value.education.push({
      institute: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      desc: "",
    });
  };

  const popEducation = () => {
    form.value.education.pop();
  };

  const addNewSkill = () => {
    form.value.skills.push({
      name: "",
      desc: "",
    });
  };

  const popSkill = () => {
    form.value.skills.pop();
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

  // const { execute: submit, loading: posting } = userApi.post();

  const resetForm = () => {
    form.value = initialForm;
  };

  return {
    form,
    // posting,
    // submit,
    resetForm,
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
  };
});

export default createUserStore;

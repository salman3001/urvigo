import { defineStore } from "pinia";
import { computed, ref } from "vue";
import qs from "qs";

const addressStore = defineStore("addressStore", () => {
  const continents = ref([]);
  const countries = ref([]);
  const states = ref([]);
  const cities = ref([]);
  const streets = ref([]);
  const customFetch = useCustomFetch()


  const getCountinents = async () => {
    const data = await customFetch<IResType<any>>("/api/address/continents");
    continents.value = data?.data as any;
    countries.value = [];
    states.value = [];
    cities.value = [];
    streets.value = [];
  };

  const getCountries = async (continentId: string) => {
    if (continentId === null) {
      countries.value = [];
      states.value = [];
      cities.value = [];
      streets.value = [];
      return;
    }

    const q = qs.stringify({
      relationFilter: {
        continent: {
          field: "id",
          value: continentId,
        },
      },
    });
    const data = await customFetch<IResType<any>>("/api/address/countries" + `?${q}`);

    countries.value = data?.data as any;
    states.value = [];
    cities.value = [];
    streets.value = [];
  };

  const getstates = async (countryId: string) => {
    if (countryId === null) {
      states.value = [];
      cities.value = [];
      streets.value = [];
      return;
    }

    const q = qs.stringify({
      relationFilter: {
        country: {
          field: "id",
          value: countryId,
        },
      },
    });
    const data = await customFetch<IResType<any>>("/api/address/states" + `?${q}`);

    states.value = data?.data as any;
    cities.value = [];
    streets.value = [];
  };

  const getCities = async (stateId: string) => {
    if (stateId === null) {
      cities.value = [];
      streets.value = [];
      return;
    }

    const q = qs.stringify({
      relationFilter: {
        state: {
          field: "id",
          value: stateId,
        },
      },
    });
    const data = await customFetch<IResType<any>>("/api/address/cities" + `?${q}`);
    cities.value = data?.data as any;
    streets.value = [];
  };

  const getStreets = async (cityId: string) => {
    if (cityId === null) {
      streets.value = [];
      return;
    }

    const q = qs.stringify({
      relationFilter: {
        city: {
          field: "id",
          value: cityId,
        },
      },
    });
    const data = await customFetch<IResType<any>>("/api/address/streets" + `?${q}`);
    streets.value = data?.data as any;
  };

  const selectContinents = computed(() =>
    continents.value
      ? continents.value.map((c: any) => ({
        label: c.name,
        value: c.id,
      }))
      : []
  );

  const selectContries = computed(() =>
    countries.value
      ? countries.value.map((c: any) => ({
        label: c.name,
        value: c.id,
      }))
      : []
  );

  const selectStates = computed(() =>
    states.value
      ? states.value.map((c: any) => ({
        label: c.name,
        value: c.id,
      }))
      : []
  );

  const selectCities = computed(() =>
    cities.value
      ? cities.value.map((c: any) => ({
        label: c.name,
        value: c.id,
      }))
      : []
  );

  const selectStreets = computed(() =>
    streets.value
      ? streets.value.map((c: any) => ({
        label: c.name,
        value: c.id,
      }))
      : []
  );

  return {
    getCountinents,
    getCountries,
    getstates,
    getCities,
    getStreets,
    selectContinents,
    selectContries,
    selectStates,
    selectCities,
    selectStreets,
  };
});

export default addressStore;

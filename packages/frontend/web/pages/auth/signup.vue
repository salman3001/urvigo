<script setup lang="ts">
import { ref } from 'vue';

const auth = authStore();
const isPwd = ref(true);
const loading = ref(false)
const config = useRuntimeConfig()
const $q = useQuasar()

const form = ref({
  firstName: '',
  lastName: '',
  businessName: '',
  email: '',
  phone: '',
  password: '',
  passwordConfirmation: '',
  userType: userTypes.USER
});

const signup = async () => {
  loading.value = true
  const res = await auth.signup(
    form.value
  );

  if (res) {
    const user = useCookie('user', {
      maxAge: 60 * 60 * 24
    })

    const token = useCookie('token', {
      maxAge: 60 * 60 * 24
    })

    const socketToken = useCookie('socketToken', {
      maxAge: 60 * 60 * 24
    })


    user.value = res?.data.user
    token.value = res?.data.token.token
    socketToken.value = res?.data?.socketToken
    const authorization = `Bearer ${toRaw(token.value)}`
    createFetch({
      baseURL: config.public.baseApi,
      headers: {
        authorization,
      },
    })


    navigateTo(routes.home)
  }


  loading.value = false
}


</script>

<template>
  <div class="row q--col-gutter-md q-pa-md q-pa-md-lg q-pa-md q-pa-lg-lg window-height" style="min-height: 100vh;">
    <div class="col-12 col-md-7 column full-height">
      <div class="col-1 ">
        <BrandLogo size="200px" :to="routes.home" />
      </div>

      <div class="col-11 row justify-center items-center q-pt-md">
        <q-card class="my-card q-pa-0 no-shadow" :class="$q.screen.lt.sm ? 'full-width' : ''"
          :style="{ translate: $q.screen.gt.md ? '0px -50px' : 'none', width: $q.screen.gt.xs ? '500px' : 'auto' }">
          <q-card-section :class="$q.screen.lt.sm ? 'q-pa-none' : ''">

            <div class="text-h4 text-weight-bold">
              Sign up
            </div>
            <p class="text-grey-8">Please enter your detail to signup</p>
          </q-card-section>

          <q-card-section class="q-pt-none q-pt-md" :class="$q.screen.lt.sm ? 'q-pa-none' : ''">
            <q-form class="q-gutter-y-sm" @submit.prevent="signup">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <label>First Name</label>
                  <q-input outlined v-model="form.firstName" dense placeholder="John"
                    :rules="[rules.required('Required')]" />
                </div>
                <div class="col-12 col-sm-6">
                  <label>Last Name</label>
                  <q-input outlined v-model="form.lastName" dense placeholder="Doe"
                    :rules="[rules.required('Required')]" />
                </div>
              </div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <label>Email adress</label>
                  <q-input outlined v-model="form.email" dense placeholder="name@example.com"
                    :rules="[rules.required('Required'), rules.email('Not A valid email')]" />
                </div>
                <div class="col-12 col-sm-6">
                  <label>Phone number</label>
                  <q-input type="number" outlined v-model="form.phone" dense placeholder="9188037****"
                    :rules="[rules.required('Required'), rules.minLength(9, 'Not a valid number')]" />
                </div>
              </div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <label>Password</label>
                  <q-input dense v-model="form.password" outlined type="password" placeholder="*********"
                    :rules="[rules.required('Required'), rules.minLength(8, 'Password Must contain * charectors')]">
                  </q-input>
                </div>
                <div class="col-12 col-sm-6">
                  <label>Confirm Password</label>
                  <q-input dense v-model="form.passwordConfirmation" outlined :type="isPwd ? 'password' : 'text'"
                    placeholder="*********"
                    :rules="[rules.required('Required'), rules.sameAs(form.password, 'Password dont match')]">

                    <template v-slot:append>
                      <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                        @click="isPwd = !isPwd" />
                    </template>
                  </q-input>
                </div>
              </div>
              <q-btn color="primary" v-if="loading" :disable="true" style="width: 100%">
                <q-circular-progress indeterminate size="20px" class="q-px-10" :thickness="1" color="primary"
                  track-color="black" style="min-width: 8rem" />
              </q-btn>
              <q-btn v-else type="submit" color="primary" style="width: 100%">Sign up</q-btn>
            </q-form>
          </q-card-section>
          <q-card-section>
            <q-separator />
          </q-card-section>

          <q-card-section class="row justify-center " :class="$q.screen.lt.sm ? 'q-pa-none' : ''">
          </q-card-section>
          <p class="q--sm text-center">Already have an account? <NuxtLink :to="routes.auth.login">Sign in</NuxtLink>
          </p>

        </q-card>
      </div>
    </div>
    <div class="col-12 col-md-5 gt-sm full-height">
      <div class="fit rounded-borders" :style="{ backgroundImage: 'url(/images/login-art.jpg)' }"></div>
    </div>
  </div>
</template>

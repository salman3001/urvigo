<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const auth = authStore();
const isPwd = ref(true);
const tab = ref('otp')
const router = useRouter()

const form = ref({
  email: '',
  otp: '',
  password: '',
  password_confirmation: '',
  userType: userTypes.USER
});

const { execute: getOTP, loading: loadingOTP } = auth.getOtp({
  onSuccess: () => {
    tab.value = 'reset'
  }
})

const { execute: resetPwd, loading: loadingReset } = auth.verifyOtpAndUpdatePWD({
  onSuccess: () => {
    tab.value = 'otp'
    router.push({ name: 'home' })
  }
})

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
              Forgot password?
            </div>
            <p class="text-grey-8">Please enter your email</p>
          </q-card-section>

          <q-card-section class="q-pt-none " :class="$q.screen.lt.sm ? 'q-pa-none' : ''">
            <q-tab-panels v-model="tab" animated>
              <q-tab-panel name="otp" class="q-pa-none">
                <q-form class="q-gutter-y-md" @submit="getOTP({ email: form.email, userType: 'customer' })">
                  <div>
                    <label>Email</label>
                    <q-input outlined v-model="form.email" dense
                      :rules="[rules.required('Email is required'), rules.email('Not a Valid Email')]" />
                  </div>
                  <q-btn color="primary" v-if="loadingOTP" :disable="true" style="width: 100%">
                    <q-circular-progress indeterminate size="20px" class="q-px-10" :thickness="1" color="grey-8"
                      track-color="orange-2" style="min-width: 8rem" />
                  </q-btn>
                  <q-btn v-else type="submit" color="primary" style="width: 100%">Get otp</q-btn>
                </q-form>
              </q-tab-panel>
              <q-tab-panel name="reset">
                <q-form class="q-gutter-y-md" @submit="() => { resetPwd(form) }">
                  <div>
                    <label>OTP</label>
                    <q-input outlined v-model="form.otp" dense type="number"
                      :rules="[rules.required(), rules.minLength(6, 'OTP must be of 6 charector')]" />
                  </div>
                  <div>
                    <label>New Password</label>
                    <q-input dense v-model="form.password" outlined :type="isPwd ? 'password' : 'text'"
                      :rules="[rules.required('Required'), rules.minLength(9, 'Password must contain 9 charectors')]">
                      <template v-slot:append>
                        <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                          @click="isPwd = !isPwd" />
                      </template>
                    </q-input>
                  </div>
                  <div>
                    <label>Confirm New Password</label>
                    <q-input dense v-model="form.password_confirmation" outlined :type="isPwd ? 'password' : 'text'"
                      :rules="[rules.required('Required'), rules.minLength(9, 'Password must contain 9 charectors'), rules.sameAs(form.password, 'Password doesnt match')]">

                      <template v-slot:append>
                        <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                          @click="isPwd = !isPwd" />
                      </template>
                    </q-input>
                  </div>
                  <q-btn color="primary" v-if="loadingReset" :disable="true" style="width: 100%">
                    <q-circular-progress indeterminate size="20px" class="q-px-10" :thickness="1" color="grey-8"
                      track-color="orange-2" style="min-width: 8rem" />
                  </q-btn>
                  <q-btn v-else type="submit" color="primary" style="width: 100%">Submit</q-btn>
                </q-form>
              </q-tab-panel>
            </q-tab-panels>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="col-12 col-md-5 gt-sm full-height">
      <div class="fit rounded-borders" :style="{ backgroundImage: 'url(/images/login-art.jpg)' }"></div>
    </div>
  </div>

</template>

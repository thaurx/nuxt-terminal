<template>
  <v-app dark>
    <!-- <v-app-bar fixed app>
      <v-toolbar-title v-text="title" />
    </v-app-bar> -->
    <v-main>
      <v-container fluid>
        <Nuxt />
      </v-container>
    </v-main>
    <!-- <v-footer absolute app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer> -->
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      title: 'Vuetify.js',
    }
  },
}
</script>

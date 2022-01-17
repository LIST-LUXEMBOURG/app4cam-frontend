<script setup lang="ts"></script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title> PolliCAM </q-toolbar-title>
      </q-toolbar>
      <q-tabs>
        <q-route-tab :to="{ name: 'Dashboard' }" label="Dashboard" />
        <q-route-tab :to="{ name: 'Shots' }" label="Shots" />
        <q-route-tab :to="{ name: 'Settings' }" label="Settings" />
      </q-tabs>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

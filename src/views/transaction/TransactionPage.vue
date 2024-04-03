<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <!-- :key="$route.fullPath" --> 
      <ion-router-outlet />
    </ion-content>
  </ion-page>
</template>

<script lang="ts" src="./transaction.component.ts"></script>
<style lang="scss" scoped src="./transactionPage.scss"></style>

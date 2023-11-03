<template>
  <v-container>
    <v-textarea v-model="bugDescription" :counter="300" label="Bug description" required></v-textarea>
    <v-select
      label="Priority"
      v-model="bugPriority"
      :items="[
        'Low',
        'Middle',
        'High',
      ]"
    ></v-select>
    <v-btn type="submit" @click="createNewBug">Create</v-btn>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { priorityToInt } from '@/utils/bugPriority';

const bugDescription = ref<string>('');
const bugPriority = ref<string>('Low');

function createNewBug() {
  alt.emit('createNewBug', bugDescription.value, priorityToInt(bugPriority.value));
}
</script>

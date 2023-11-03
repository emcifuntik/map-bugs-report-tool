<template>
  <v-navigation-drawer>
    <v-list-item title="Bugs"></v-list-item>
    <v-divider></v-divider>
    <router-link :to="{ name: 'BugNew' }">
      <v-list-item link title="New bug"></v-list-item>
    </router-link>
    <v-divider></v-divider>
    <!-- Use bugs from the store -->
    <v-virtual-scroll :items="bugs">
      <template v-slot:default="{ item }">
        <router-link :to="{ name: 'BugEdit', params: { bugId: item.id } }">
          <v-list-item
            style="user-select: none"
            link
            :title="'Bug #' + item.id"
            >{{
              item.description.length > 20
                ? item.description.substring(0, 20).trim() + "..."
                : item.description
            }}</v-list-item
          >
        </router-link>
      </template>
    </v-virtual-scroll>
  </v-navigation-drawer>
  <router-view />
</template>


<script lang="ts" setup>
import { computed } from 'vue';
import store from '@/store';

// Use a computed property to get bugs from the store
const bugs = computed(() => store.state.bugs);

</script>


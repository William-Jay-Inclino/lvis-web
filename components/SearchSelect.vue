<template>
    <div class="autosuggest">
      <input type="text" class="form-control" v-model="searchTerm" @input="filterItems" placeholder="Search Employee...">
      <div v-if="showSuggestions" class="suggestions">
        <div v-for="item in filteredItems" :key="item" class="suggestion" @click="selectItem(item)">
          {{ item }}
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  
  const items = ref(["Apple", "Banana", "Cherry", "Grape", "Lemon", "Orange"]);
  const searchTerm = ref("");
  const showSuggestions = ref(false);
  
  const filteredItems = computed(() => {
    return items.value.filter(item => item.toLowerCase().includes(searchTerm.value.toLowerCase()));
  });
  
  const filterItems = () => {
    showSuggestions.value = true;
  };
  
  const selectItem = (item: string) => {
    searchTerm.value = item;
    showSuggestions.value = false;
  };
  </script>
  
  <style scoped>
  .autosuggest {
    position: relative;
  }
  
  input.form-control {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  
  input.form-control:focus {
    outline: none;
  }
  
  .suggestions {
    position: absolute;
    z-index: 1000;
    width: 100%;
    max-height: 150px;
    overflow-y: auto;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .suggestion {
    padding: 5px 10px;
    cursor: pointer;
  }
  
  .suggestion:hover {
    background-color: #f1f1f1;
  }
  </style>
  
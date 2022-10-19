
<template>
	<!-- <div class="card">
    <input id="greet-input" v-model="name" placeholder="Enter a name..." />
    <button type="button" @click="greet()">Greet</button>
  </div>
  
  <p>{{ greetMsg }}</p> -->
  
  <div>
	  {{ texto }}

	  <div class="card">
		<input type="text" v-model="name">
    <button type="button" @click="invo()">Greet</button>
  </div>
  
  <p>{{ invo_valkue }}</p>

  </div>

  
	
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { invoke } from "@tauri-apps/api/tauri";

export default defineComponent({
	data() {
		return {
			texto: "xxxxxxx" as string,
			invo_valkue: '' as any,
			name: '' as any
		};
	},
	methods : {
		async invo(){
			// this.invo_valkue = await invoke("my_custom_command");
			// this.invo_valkue = await invoke("greetx", { name: this.name });
		}
	}
})
</script>
<!-- setup lang="ts"-->
<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import starter from './views/mono/starter.vue';
/* export default {
	data(){
		return{
			msg: "114514"
		}
	}
} */
</script>

<template>
	<starter/>
	<a href="./browser/Voca.html">舊版頁面</a>
 <div>
		<a href="https://vitejs.dev" target="_blank">
			<img src="/vite.svg" class="logo" alt="Vite logo" />
		</a>
		<a href="https://vuejs.org/" target="_blank">
			<img src="assets/vue.svg" class="logo vue" alt="Vue logo" />
		</a>
	</div>
	<HelloWorld msg="Vite + Vue" />
	<h3>模板語法</h3>
	<!-- <p>{{ msg }}</p> -->
	<a href="browser/Voca.html" class="">go</a>
</template>

<style scoped>
.logo {
	height: 6em;
	padding: 1.5em;
	will-change: filter;
	transition: filter 300ms;
}
.logo:hover {
	filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
	filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

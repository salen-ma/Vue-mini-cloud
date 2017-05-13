<template>
	<span class="alert-box" :class="{move:alertInfo.isShow,success:alertInfo.isSuccess,warn:!alertInfo.isSuccess}">
		<span>{{alertInfo.value}}</span>
		<i class="icon bg2"></i>
	</span>	
</template>

<script>
	export default {
		props:["alertInfo"]
	}
</script>
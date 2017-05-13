<template>
	<div class="bread-crumbs">
		<template v-for="item,index of parentsData">
			<a 
				@click.prevent = "gotoFile(item.id,item.floor)"
				:class="{'last-crumbs':index === parentsData.length-1}"
			>
				{{item.name}}
			</a>
			<span class="next" v-if="index !== parentsData.length-1">></span>
		</template>
	</div>
</template>

<script>
	import dataUtils from '../assets/js/data-utils.js'

	export default {	
		props: {
			data: {
				type: Array
			}
		},
		computed:{
			parentsData(){
				return dataUtils.getParentsById(this.data, this.data[0].currentId).reverse();
			},
			currentData(){
				return dataUtils.getChildrenById(this.data, this.data[0].currentId)
			}			
		},
		methods:{
			gotoFile(id,floor){				
				this.data[0].currentId = id	
				this.data[0].currentFloor = floor + 1
				this.cancelChecked()
			},
			cancelChecked(){
				this.currentData.forEach(function(item){
					item.checked = false;
				})				
			}
		}
	}
</script>
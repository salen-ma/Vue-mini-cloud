<template>
	<ul>
		<li v-for="item,index of data" :key="index">
			<span 
				:class="{
					open:item.child.length,
					close:!item.child.length,
					active:item.id === allData[0].currentId
				}" 
				:style="[stylePadding]"
				@click="gotoFile(item.id)"
			>
				<i class="bg"></i>
				{{item.name}}
			</span>
			<file-tree 
				v-if="item.child.length" 
				:data="item.child"
				:increment = "count"
				@gotoFile="gotoFile"
				@cancelChecked="cancelChecked"				
			></file-tree >
		</li>			
	</ul>		
</template>

<script>
	
	import Data from '../assets/js/data.js'
	import dataUtils from '../assets/js/data-utils.js'

	export default {
		name:'file-tree',		
		props: {
			data: {
				type: Array
			},
			increment:{
				type:Number,
				default:0
			}
		},
		data(){
			return {
				allData:Data.files
			}
		},
		computed:{
			currentData(){
				return dataUtils.getChildrenById(this.allData, this.allData[0].currentId)
			},
			count(){
				var c = this.increment;
				return ++c;
			},
			stylePadding(){
				return{
					'padding-left':this.count * 20 + 'px'
				}
			}					
		},		
		methods:{
			gotoFile(id){				
				this.$emit('gotoFile',id)
			},
			cancelChecked(){
				this.$emit('cancelChecked')				
			}
		}
	}

</script>
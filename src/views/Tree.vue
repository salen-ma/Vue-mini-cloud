<template>
	<ul>
		<li v-for="item,index of data" v-if="!isHide(item.id)" :key="index">
			<span 
				:class="{
					open:item.child.length,
					close:!item.child.length,
					active:item.id === activeId
				}" 
				:style="[stylePadding]"
				@click="clickEvent(item.id,item.name)"
			>
				<i class="bg"></i>
				{{item.name}}
			</span>
			<file-tree 
				v-if="item.child.length" 
				:data="item.child"
				:increment = "count"
				:activeId="activeId"
				:checkedId="checkedId"
				@clickEvent="clickEvent"			
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
			checkedId: {
				type: Array
			},			
			increment:{
				type:Number,
				default:0
			},
			activeId:{
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
			clickEvent(id,name){				
				this.$emit('clickEvent',id,name)
			},
			isHide(name){
				if(this.checkedId){
					return this.checkedId.some( (item)=>{
						return item === name
					})
				}
			}
		}
	}

</script>
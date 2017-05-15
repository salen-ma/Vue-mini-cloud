<template>
	<ul>
		<li v-for="item,index of data" v-if="!item.checked" :key="index">
			<span 
				:class="{
					open:item.child.length,
					close:!item.child.length,
					active:item.id === allData[0].targetId
				}" 
				:style="[stylePadding]"
				@click="targetFile(item.id,item.name)"
			>
				<i class="bg"></i>
				{{item.name}}
			</span>
			<move-list 
				@getTarget = "getTargetFolder"
				v-if="item.child.length" 
				:data="item.child"
				:increment = "count"
			></move-list >
		</li>			
	</ul>		
</template>

<script>
	
	import Data from '../assets/js/data.js'
	import dataUtils from '../assets/js/data-utils.js'

	export default {
		name:'move-list',		
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
				allData:Data.files,
				targetId:[0]
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
			targetFile(id,name){			
				this.allData[0].targetId = id	
				this.$emit('getTarget',id,name)
			},
			getTargetFolder(id,name){	// 由于是递归组件，需要层层向上传递自定义事件
				this.$emit('getTarget',id,name)
			}
		}
	}

</script>
<template>
	<ol class="file-list thumb-view">
		<li 
			v-for="item,index in currentData"
			class="folder thumb"
			:class="{checked:item.checked}"
			@click="gotoFile(item.id)"
		>
            <i class="icon folder-icon bg"></i>
            <span 
	            class="name" 
	            :class="{active:item.isRename}" 
	            @click.stop = "renameFile(item)"
            >
            	{{item.name}}
            </span>
            <input 
            	ref="text"
	            type="text" 
	            class="rename" 
	            :class="{active:item.isRename}" 
	            v-model="item.name"
	            v-select="item.isRename"
	            @click.stop
	            @keyup.13="successReName(item,index)"
	            @blur="successReName(item,index)"
	            @keyup.27="exitReName(item,index)"
            />
            <a class="checkbox bg" @click.stop="item.checked = !item.checked"></a>
        </li>
	</ol>
</template>

<script>
	import dataUtils from '../assets/js/data-utils.js'
	export default {
		props:{
			data:{
				type: Array
			}
		},
		data(){
			return {
				preName:''
			}
		},
		directives:{
			select:{
				update(el,{value}){
					if(value) {
						if(!el.selected){
							el.select()
							el.selected = true
						}
					}
				},
				inserted(el,{value}){
						if(value) {
							if(!el.selected){
								el.select()
								el.selected = true
							}
						}
					}				
				}
		},
		computed:{
			currentData(){
				return dataUtils.getChildrenById(this.data, this.data[0].currentId)
			}
		},
		methods:{
			gotoFile(id){				
				this.data[0].currentId = id	
				this.cancelChecked()
			},
			cancelChecked(){
				this.currentData.forEach(function(item){
					item.checked = false;
				})				
			},
			renameFile(item){
				this.preName = item.name
				item.isRename = true
			},
			successReName(item,index){
				let len = this.currentData.filter( (value) =>{
					return value.name === item.name
				}).length

				if(len > 1){
					this.$refs.text.forEach( (value) =>{
						value.focus()
					})	
					this.$emit('fail','命名冲突')	

					this.$refs.text.forEach( (value) =>{
						value.selected = false
					})					

					return
				}

				this.$refs.text.forEach( (value) =>{
					value.selected = false
				})

				if( !item.name.trim() ){
					this.exitReName(item,index)
					return
				}				

				if(item.creating){
					item.creating = false
					item.isRename = false
					this.$emit('success','新建成功')
					return
				}

				if(item.isRename){	
				// 解决回车时同时触发onblur,会同时发生新建成功和命名成功的问题
					this.$emit('success','命名成功')
					item.isRename = false
				}
			},
			exitReName(item,index){
				if(item.creating){
					this.currentData.splice(index,1)
					this.$emit('fail','取消新建')
					return
				}

				this.$emit('fail','取消命名')
				item.name = this.preName
				item.isRename = false
			}
		}
	}
</script>
<template>
	<ol 
		class="file-list" 
		:class="{'thumb-view':viewType === 'thumb'}" 
		@mousedown="select"
	>
		<li 
			v-for="item,index in currentData"
			:key="index"
			class="folder"
			:class="{checked:item.checked,thumb:viewType==='thumb',list:viewType==='list'}"
			@click="gotoFile(item.id)"
			:data-index="index"
		>
			<!-- 列表视图 -->
			<a 
				v-if=" viewType==='list' "	
				class="checkbox bg" 
				@click.stop="item.checked = !item.checked"
			></a>
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
	            @keyup.13="sureRename(item,index)"
	            @blur="sureRename(item,index)"
	            @keyup.27="exitReName(item,index)"
            />
            <!-- 列表视图 -->
            <template v-if=" viewType==='list' ">
				<div class="fn-btn">
	                <i class="icon fn-icon share-icon bg" @click.stop></i>
	                <i class="icon fn-icon down-icon bg" @click.stop></i>
	                <i class="icon fn-icon move-icon bg" @click.stop="moveFile(item,index)"></i>
	                <i class="icon fn-icon delete-icon bg" @click.stop="deleteFile(index)">
	                </i>
	                <i class="icon fn-icon rename-icon bg" @click.stop="renameFile(item)"></i>      
	            </div>
	            <time>{{item.time}}</time>   
            </template>         
            <a 
            	v-if=" viewType==='thumb' "
	            class="checkbox bg" 
	            @click.stop="item.checked = !item.checked"
            ></a>
        </li>
	</ol>
</template>

<script>
	import dataUtils from '../assets/js/data-utils.js'
	import eventUtils from '../assets/js/event-utils.js'
	export default {
		props:["data","viewType","sortType","preName"],
		directives:{   // 自定义指令,点击重命名时选中输入框文本
			select:{
				update(el,{value}){
					if(value) {
						if(!el.selected){	// 用来处理视图更新时,输入框文本被重复选中
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
			currentData(){	// 根据当前排序方式,对当前数据进行排序
				let currentData = dataUtils.getChildrenById(this.data, this.data[0].currentId)
				dataUtils._sort(currentData,this.sortType)
				return currentData
			}
		},
		methods:{
			gotoFile(id){		
				this.$emit('gotoFile',id)		
			},
			cancelChecked(){
				this.$emit('cancelChecked')				
			},
			renameFile(item){
				this.$emit('rename',item)
			},
			sureRename(item,index){	
				// 判断命名是否冲突
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

				// 若文件名为空,按取消命名处理
				if( !item.name.trim() ){
					this.exitReName(item,index)
					return
				}				

				// 新建状态则显示新建成功,命名状态则显示命名成功
				if(item.creating){
					item.creating = false
					item.isRename = false
					this.$emit('success','新建成功')
					return
				}

				if(item.isRename){	
					this.$emit('success','命名成功')
					item.isRename = false
				}
			},
			exitReName(item,index){
				// 新建状态则显示取消新建,命名状态则显示取消命名
				if(item.creating){
					item.creating = false
					item.isRename = false
					this.currentData.splice(index,1)
					this.$emit('fail','取消新建')
					return
				}

				this.$emit('fail','取消命名')
				item.name = this.preName
				item.isRename = false
			},
			deleteFile(index){
				this.$emit('delete','singleDelete',index)
			},
			moveFile(item,index){
				item.checked = true
				if(this.data[0].currentId === 0 && this.currentData.length === 1){
					this.$emit('fail','没有可移动到的文件夹')
					return;
				}

				this.$emit('move','singleMove',index)
			},
			select(e){
				let This = this
				eventUtils.dragSelect(e,This)
			}			
		}
	}
</script>
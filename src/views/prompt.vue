<template>
	<div class="mask" :class="{active:deleteInfo.isDeleting || moveInfo.isMoving}">
		<!-- 删除确认框 -->
		<div class="sure-delete" :class="{active:deleteInfo.isDeleting}">
			<p>确认删除吗？</p>
			<div class="btn-wrap">
				<span class="sure" @click="sureDelete">确认</span>
				<span class="cancel" @click="cancelDelete">取消</span>
			</div>
		</div>
		<!-- 移动选择菜单 -->		
		<div class="move-menu" :class="{active:moveInfo.isMoving}" ref="menu">
			<div class="menu-head" ref="menuHead">
				选择存储位置
				<i class="close-mask" @click="cancelMove">×</i>
			</div>
			<div class="menu-body">
				<div class="checked-lable">
					<span class="checked-file">
						<i class="bg"></i>
						<span class="checked-file-name">
							{{checkedFile[0] ? checkedFile[0].name : ''}}</span>
						</span>
					<span class="checked-count" v-if="checkedFile.length-1">等{{checkedFile.length}}个文件</span>
				</div>
				<div class="menu-list">
					<div class="move-to">
						<span class="move-to-target">移动到 : {{this.targetName}}</span>
					</div>
					<div class="file-tree">
						<move-list :data="data" @getTarget="getTargetFolder"/>
					</div>
				</div>
				<span class="cancel-move"  @click="cancelMove">取消</span>
				<span class="sure-move active"  @click="sureMove">确定</span>
			</div>
			<p class="move-alert-box">不能移动到自身或自身的子文件夹内</p>
			<div class="name-repeat-menu" :class="{active:isNameRepeat}">
				<div class="box">
					<div>
						文件夹中包含重名的文件，请选择接下来的操作
					</div>
					<div>
						<span class="cover" @click="coverName">覆盖</span>
						<span class="over-name" @click="overName">创建副本</span>
						<span class="cancel" @click="cancelMove">取消</span>
					</div>
				</div>
			</div>
		</div>
	</div>	
</template>

<script>
	import dataUtils from '../assets/js/data-utils.js'
	import eventUtils from '../assets/js/event-utils.js'

	import MoveList from '../views/MoveList.vue'

	export default {
		props:["deleteInfo","moveInfo","data"],
		data(){
			return {
				targetName:'微云',
				targetId:0,
				isNameRepeat:false,
				movedRepeatNameData:[],
				targetRepeatNameData:[],
				movedData:[]
			}
		},
		components:{
			'move-list': MoveList
		},
		updated(){
			if(this.moveInfo.isMoving){
				eventUtils.drapEle(this.$refs.menuHead,this.$refs.menu,true)
			}			
		},		
		computed:{
			currentData(){
				return dataUtils.getChildrenById(this.data, this.data[0].currentId)
			},
			checkedFile(){
				return this.currentData.filter( (item) =>{
					return item.checked
				})
			},
			targetData(){
				return dataUtils.getChildrenById(this.data, this.targetId)
			}		
		},		
		methods:{
			sureDelete(){
				for(var i=0; i<this.currentData.length; i++){
					if(this.currentData[i].checked){
						this.currentData.splice(i,1)
						i--
					}					
				}
				this.$emit('success','删除成功')
				this.deleteInfo.isDeleting = false
			},
			cancelDelete(){
				this.$emit('fail','取消删除')
				this.deleteInfo.isDeleting = false
			},
			sureMove(){				
				if(this.data[0].currentId === this.targetId){
					this.$emit('fail','已经在该文件夹下')
					return
				}	

				for(var i=0; i<this.currentData.length; i++){
					if(this.currentData[i].checked){
						this.movedData.push( ...this.currentData.splice(i,1) )
						i--
					}					
				}							

				this.dealNameRepeat()
				if(this.isNameRepeat){
					return
				}
				
				this.moveSuccess()
			},
			cancelMove(){
				this.currentData.push(...this.movedData)

				this.movedData = []
				this.movedRepeatNameData = []
				this.targetRepeatNameData = []

				this.$emit('fail','取消移动')
				this.moveInfo.isMoving = false
				this.isNameRepeat = false
			},
			getTargetFolder(id,name){
				this.targetName = name
				this.targetId = id

				if(this.data[0].currentId === id){
					this.$emit('fail','已经在该文件夹下')
				}
			},
			dealNameRepeat(){
				this.targetData.forEach( (item) =>{
					this.movedData.forEach( (value) =>{
						if( item.name === value.name ){
							this.movedRepeatNameData.push(value)
							this.targetRepeatNameData.push(item)
						}
					})
				})

				if(this.movedRepeatNameData.length){
					this.isNameRepeat = true
				}
			},
			coverName(){
				for(var i=0; i<this.targetData.length; i++){
					for(var j=0; j<this.targetRepeatNameData.length; j++){
						if( this.targetData[i] === this.targetRepeatNameData[j]){
							this.targetData.splice(i,1)
						}					
					}										
				}

				this.moveSuccess()
			},
			overName(){
				let i = 1
				this.movedRepeatNameData.forEach( (item) =>{
					item.name = item.name+'('+i+')'	

					this.targetData.forEach( (item) =>{
						this.movedRepeatNameData.forEach( (value) =>{
							if( item.name === value.name ){
								i++
								value.name=value.name.substr(0,value.name.length-3)+'('+i+')'	
							}
						})
					})

				})

				this.moveSuccess()				
			},
			moveSuccess(){
				this.movedData.forEach( (item) =>{
					item.checked = false
					item.pId = this.targetId
				})

				this.targetData.push(...this.movedData)

				this.movedData = []
				this.movedRepeatNameData = []
				this.targetRepeatNameData = []

				this.$emit('success','移动成功')
				this.moveInfo.isMoving = false
				this.isNameRepeat = false				
			}					
		}
	}
</script>
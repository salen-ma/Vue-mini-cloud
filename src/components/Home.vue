<template>
	<section class="main">
		<alert-box :alertInfo="alertInfo"></alert-box>
		<prompt-box 
			:data="data" 
			:deleteInfo="deleteInfo" 
			:moveInfo="moveInfo"
			@success="dealSuccess" 
			@fail="dealFail"
		>
		</prompt-box>
		<custom-header 
			:data="data" 
			@delete="deleteFile" 
			@move="moveFile" 
			@fail="dealFail"
			@viewchange="changeView"
			@sortchange="changeSort"
			@rename="renameFile"
			@createFolder="createFolder"
		></custom-header>
		<div class="body">
			<div class="layout-aside">
				<div class="user-pic bg"><img src="../assets/img/user_pic.png" alt=""></div>
				<div class="file-tree">
					<file-tree 
						:data="data"
						:activeId="activeId"
						@clickEvent="gotoFile"
						@cancelChecked="cancelChecked"						 
					/>
				</div>		
			</div>	
			<div class="layout-main">
				<div class="crumbs-wrap">
					<a 
						class="checkbox bg"
						:class="{checked:isAllChecked}"
						@click.prevent = "isAllChecked=!isAllChecked"
					></a>
					<span class="next">|</span>					
					<bread-crumbs 
						:data="data" 
						@gotoFile="gotoFile"
						@cancelChecked="cancelChecked"					
					/>
				</div>
				<div 
					class="file-wrap" 
					@contextmenu.prevent="showContextmenu"
					@mousedown="hideContextmenu"
				>
					<file-list 
						:data="data" 
						:viewType="viewType"
						:sortType="sortType"
						:preName="preName"
						@success="dealSuccess" 
						@fail="dealFail"
						@delete="deleteFile" 
						@move="moveFile"
						@rename="renameFile"
						@gotoFile="gotoFile"
						@cancelChecked="cancelChecked"
					/>
					<ul class="contextmenu" ref="_contextmenu">
						<li 
							class="menu-item create"
							@click="createFolder"
						>
							新建
						</li>
					    <li 
					    	class="menu-item rename"
					    	@click="rename"
					    >
					    	重命名
					    </li>
					    <li 
						    class="menu-item delete" 
						    @click="deleteFile('allDelete')"
					    >
					    	删除
					    </li>
					    <li 
					    	class="menu-item move"
							@click="move"
					    >
					    	移动
					    </li>
					    <li 
					    	class="menu-item open"
							@click="openFile"
					    >
					    	打开
					    </li>
					    <li class="menu-item attr">属性</li>
					</ul>						
				</div>
			</div>			
		</div>
	</section>
</template>

<script>
	// tool
	import Data from '../assets/js/data.js'
	import dataUtils from '../assets/js/data-utils.js'
	import eventUtils from '../assets/js/event-utils.js'

	// view components
	import Header from '@/views/Head.vue'
	import Tree from '@/views/Tree.vue'
	import Files from '@/views/Files.vue'
	import Crumb from '@/views/Crumb.vue'

	// dealInfo
	import AlertBox from '@/views/alert.vue'
	import promptBox from '@/views/prompt.vue'

	export default {
		data(){
			return {
				data:Data.files,
				alertInfo:{
					isSuccess:true,
					isShow:false,
					value:''					
				},
				deleteInfo:{
					isDeleting:false,
					deleteType:'allDelete',
					fileIndex:0
				},
				moveInfo:{
					isMoving:false,
					moveType:'allMove',
					fileIndex:0					
				},
				preName:'',
				viewType:'thumb',
				sortType:'time'		
			}
		},
		components:{
			'custom-header': Header,
			'file-tree': Tree,
			'file-list': Files,
			'bread-crumbs': Crumb,
			'alert-box': AlertBox,
			'prompt-box': promptBox
		},
		computed:{
			checkedFileLength(){
				return this.currentData.filter(function(item){
					return item.checked;
				}).length
			},
			isAllChecked:{
				get(){
					return this.checkedFileLength === this.currentData.length && this.currentData.length;						
				},
				set(val){
					if(val){
						this.currentData.forEach(function(item){
							item.checked = true;
						})
					}else{
						this.currentData.forEach(function(item){
							item.checked = false;
						})					
					}
				}
			},
			currentData(){
				return dataUtils.getChildrenById(this.data, this.data[0].currentId)
			},
			activeId(){
				return this.data[0].currentId
			}			
		},
		methods:{
			openFile(){ // 右键打开
				if(!this.checkedFileLength){
					this.dealFail('请选择文件')
					return
				}	

				// 打开被选中的第一个文件夹
				let id = this.currentData.filter( (item) =>{
					return item.checked
				})[0].id

				this.gotoFile(id)	

				// 隐藏右键菜单
				let _contextmenu = this.$refs._contextmenu
				eventUtils.hideContextmenu(_contextmenu)							
			},
			gotoFile(id){				
				this.data[0].currentId = id	
				this.cancelChecked()
			},
			cancelChecked(){
				this.currentData.forEach(function(item){
					item.checked = false;
				})				
			},			
			dealSuccess(value){	// 操作成功
				this.alertInfo.value = value // 操作信息
				this.alertInfo.isSuccess = true
				this.alertInfo.isShow = true
				setTimeout( () =>{
					this.alertInfo.isShow= false
				},600)				
			},
			dealFail(value){ // 操作失败/取消操作
				this.alertInfo.value = value
				this.alertInfo.isSuccess = false
				this.alertInfo.isShow = true
				setTimeout( () =>{
					this.alertInfo.isShow= false
				},600)				
			},
			rename(){	// 右键重命名
				if(!this.checkedFileLength){
					this.dealFail('请选择文件')
					return
				}	

				let item = this.currentData.filter( (item) =>{
					return item.checked
				})[0]	

				this.renameFile(item)

				let _contextmenu = this.$refs._contextmenu
				eventUtils.hideContextmenu(_contextmenu)				
			},
			renameFile(item){
				this.preName = item.name
				item.isRename = true			
			},
			deleteFile(type,index){
				if(!this.checkedFileLength){
					this.dealFail('请选择文件')
					return
				}

				this.deleteInfo.deleteType = type
				this.deleteInfo.fileIndex = index
				this.deleteInfo.isDeleting = true

				let _contextmenu = this.$refs._contextmenu
				eventUtils.hideContextmenu(_contextmenu)
			},
			move(){	  // 右键移动
				if(!this.checkedFileLength){
					this.dealFail('请选择文件')
					return
				}				
				this.moveFile('allMove')
				let _contextmenu = this.$refs._contextmenu
				eventUtils.hideContextmenu(_contextmenu)
			},
			moveFile(type,index){
				this.moveInfo.moveType = type
				this.moveInfo.fileIndex = index				
				this.moveInfo.isMoving = true				
			},
			createFolder(){
				this.data[0].maxId++
				let newData = {
						name: '',
						id:this.data[0].maxId,
						pId:this.data[0].currentId,
						type: 'folder',
						checked:false,
						isRename:true,
						creating:true,
						time:dataUtils.getNowTime(),
						timeStamp:Date.now(),						
						child:[]
					}
				this.currentData.unshift(newData)	

				let _contextmenu = this.$refs._contextmenu
				eventUtils.hideContextmenu(_contextmenu)							
			},
			changeView(view){ // 改变视图样式
				this.viewType = view
			},
			changeSort(sort){ // 改变排序方式
				this.sortType = sort
			},
			showContextmenu(e){   // 显示右键菜单
				let _contextmenu = this.$refs._contextmenu
				let This = this

				eventUtils.showContextmenu(e,_contextmenu,This)
			},
			hideContextmenu(e){	  // 隐藏右键菜单
				if(e.buttons !== 1){
					return;
				}				

				let _contextmenu = this.$refs._contextmenu
				if(!e.target.classList.contains('menu-item')){
				    eventUtils.hideContextmenu(_contextmenu)
			    }
			}
		}				
	}
</script>
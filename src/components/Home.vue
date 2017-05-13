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
		></custom-header>
		<div class="body">
			<div class="layout-aside">
				<div class="user-pic bg"><img src="../assets/img/user_pic.png" alt=""></div>
				<div class="file-tree">
					<file-tree :data="data" />
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
					<bread-crumbs :data="data" />
				</div>
				<div class="file-wrap">
					<file-list :data="data" @success="dealSuccess" @fail="dealFail"/>
					<ul class="contextmenu">
						<li class="menu-item create">新建</li>
					    <li class="menu-item rename">重命名</li>
					    <li class="menu-item delete">删除</li>
					    <li class="menu-item move">移动</li>
					    <li class="menu-item open">打开</li>
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

	// views components
	import Header from '../views/Head.vue'
	import Tree from '../views/Tree.vue'
	import Files from '../views/Files.vue'
	import Crumb from '../views/Crumb.vue'

	import AlertBox from '../views/alert.vue'
	import promptBox from '../views/prompt.vue'

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
					isDeleting:false
				},
				moveInfo:{
					isMoving:false
				}
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
			isAllChecked:{
				get(){
					return this.currentData.filter(function(item){
						return item.checked;
					}).length === this.currentData.length && this.currentData.length;						
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
			}			
		},
		methods:{
			dealSuccess(value){
				this.alertInfo.value = value
				this.alertInfo.isSuccess = true
				this.alertInfo.isShow = true
				setTimeout( () =>{
					this.alertInfo.isShow= false
				},600)				
			},
			dealFail(value){
				this.alertInfo.value = value
				this.alertInfo.isSuccess = false
				this.alertInfo.isShow = true
				setTimeout( () =>{
					this.alertInfo.isShow= false
				},800)				
			},
			deleteFile(){
				this.deleteInfo.isDeleting = true
			},
			moveFile(){
				this.moveInfo.isMoving = true
			}
		}				
	}
</script>
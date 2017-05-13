<template>
	<header class="head">
		<div class="init" :class="{active:isChecked}">
			<h1 class="logo">
				<a href="javascript:;" class="bg">微云</a>
			</h1>
			<span class="file-manage">
				<i class="icon bg"></i>
			</span>
			<form class="mod-search">
				<i class="icon bg"></i>
				<input type="text" placeholder="输入文件名" class="mod-input">
			</form>
			<div class="view-item-list">
				<div class="view-switch">
					<a href="javascript:;" class="view-list">
						<i class="icon bg"></i>
					</a>
					<a href="javascript:;" class="view-thumb active">
						<i class="icon bg"></i>
					</a>
				</div>
				<div class="rank-switch">
					<a href="javascript:;" class="time-sort active">
						<i class="icon bg"></i>
					</a>
					<a href="javascript:;" class="letter-sort">
						<i class="icon bg"></i>
					</a>
				</div>				
			</div>
			<div class="upload">
				<a href="javascript:;" class="btn">
					<i class="icon bg"></i>
					<span>添加</span>
				</a>
				<ul class="upload-dropdown">
					<li class="upload-item">
						<div class="inner">
							<i class="icon-upload bg2"></i>
							<p class="text">上传文件</p>
						</div>
					</li>
					<li class="upload-item">
						<div class="inner">
							<i class="icon-upload bg2"></i>
							<p class="text">上传文件夹</p>
						</div>
					</li>
					<li class="upload-item">
						<div class="inner">
							<i class="icon-upload bg2"></i>
							<p class="text">离线下载</p>
						</div>
					</li>
					<li class="upload-item" @click = "createFolder">
						<div class="inner">
							<i class="icon-upload bg2"></i>
							<p class="text">创建文件夹</p>
						</div>
					</li>
					<li class="upload-item">
						<div class="inner">
							<i class="icon-upload bg2"></i>
							<p class="text">添加笔记</p>
						</div>
					</li>
				</ul>
			</div>
		</div>
		<div class="checked" :class="{active:isChecked}">
			<h1 class="logo">
				<a href="javascript:;" class="bg">微云</a>
			</h1>		
			<a class="cancel-select" @click.prevent="cancelChecked">
				取消选择
			</a>		
			<a href="javascript:;" class="sum-select">
				选择了{{isChecked}}项
			</a>
			<div class="fn-btn">
				<a href="javascript:;">
					<i class="icon down-icon bg"></i>
					下载
				</a>
				<a href="javascript:;">
					<i class="icon share-icon bg"></i>
					分享
				</a>
				<a  @click.prevent="moveFile">
					<i class="icon move-icon bg"></i>
					移动到
				</a>
				<a @click.prevent="renameFile">
					<i class="icon rename-icon bg"></i>
					重命名
				</a>
				<a @click.prevent="deleteFile">
					<i class="icon delete-icon bg"></i>
					删除
				</a>
			</div>
		</div>
	</header>	
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
			currentData(){
				return dataUtils.getChildrenById(this.data, this.data[0].currentId)
			},
			isChecked(){
				return this.currentData.filter(function(item){
					return item.checked
				}).length				
			}
		},
		methods:{
			cancelChecked(){
				this.currentData.forEach(function(item){
					item.checked = false;
				})				
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
						child:[]
					}

				this.currentData.unshift(newData)
			},
			deleteFile(){
				this.$emit('delete')				
			},
			renameFile(){
				this.currentData.filter( (item) =>{
					return item.checked
				})[0].isRename = true				
			},
			moveFile(){
				if(this.data[0].currentId === 0 && this.isChecked == this.currentData.length){
					this.$emit('fail','没有可移动到的文件夹')
					return;
				}

				this.$emit('move')
			}
		}		
	}
</script>
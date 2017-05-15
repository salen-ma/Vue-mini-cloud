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
					<a 
						class="view-list" 
						:class="{active:viewType === 'list'}" 
						@click.prevent="changeView('list')"
					>
						<i class="icon bg"></i>
					</a>
					<a 
						class="view-thumb" 
						:class="{active:viewType === 'thumb'}"
						@click.prevent="changeView('thumb')"
					>
						<i class="icon bg"></i>
					</a>
				</div>
				<div class="rank-switch">
					<a 
						class="time-sort"
						:class="{active:sortType === 'time'}"
						@click.prevent="changeSort('time')"						
					>
						<i class="icon bg"></i>
					</a>
					<a 
						class="letter-sort"
						:class="{active:sortType === 'letter'}"
						@click.prevent="changeSort('letter')"						
					>
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
		data(){
			return {
				viewType:'thumb',
				sortType:'time'
			}
		},
		computed:{
			currentData(){
				return dataUtils.getChildrenById(this.data, this.data[0].currentId)
			},
			isChecked(){	// 判断是否有文件被选中
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
				this.$emit('createFolder')
			},
			deleteFile(){
				this.$emit('delete','allDelete')				
			},
			renameFile(){	// 重命名被选中文件中的第一个
				let item = this.currentData.filter( (item) =>{
					return item.checked
				})[0]
				this.$emit('rename',item)			
			},
			moveFile(){
				if(this.data[0].currentId === 0 && this.isChecked == this.currentData.length){
					this.$emit('fail','没有可移动到的文件夹')
					return;
				}

				this.$emit('move','allMove')
			},
			changeView(view){
				this.viewType = view
				this.$emit('viewchange',view)
			},
			changeSort(sort){
				this.sortType = sort
				this.$emit('sortchange',sort)
			}
		}		
	}
</script>
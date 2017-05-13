import dataUtils from './data-utils.js'

var Data = {
	files: [
		{
			name: '微云',
			id: 0,
			maxId:5,
			currentId:0,
			targetId:0,	
			type: 'root',
			child: [
				{
					name: '视频',
					id: 1,
					pId: 0,
					type: 'folder',
					checked:false,
					isRename:false,
					child: [
						{
							name: 'aaa',
							id:4,
							pId:1,
							type: 'folder',
							checked:false,
							isRename:false,
							child:[]
						}
					]					
				},
				{
					name: '音乐',
					id: 2,
					pId: 0,
					type: 'folder',
					checked:false,
					isRename:false,
					child: []					
				},
				{
					name: '小说',
					id: 3,
					pId: 0,
					type: 'folder',
					checked:false,
					isRename:false,
					child: []					
				},
				{
					name: 'aaa',
					id: 5,
					pId: 0,
					type: 'folder',
					checked:true,
					isRename:false,
					child: []					
				}																
			]
		}
	]
}

export default Data
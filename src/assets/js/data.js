
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
					timeStamp:1494810874057,					
					child: [
						{
							name: 'aaa',
							id:4,
							pId:1,
							type: 'folder',
							checked:false,
							isRename:false,
							timeStamp:1494811874057,
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
					timeStamp:1494812874057,
					child: []					
				},
				{
					name: '小说',
					id: 3,
					pId: 0,
					type: 'folder',
					checked:false,
					isRename:false,
					timeStamp:1494813874057,
					child: []					
				},
				{
					name: 'aaa',
					id: 5,
					pId: 0,
					type: 'folder',
					checked:true,
					isRename:false,
					timeStamp:1494814874057,
					child: []					
				}																
			]
		}
	]
}

export default Data
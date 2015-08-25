# ==================================================
# 行业结构图
# 重新使用canvas实现, 增加交互效果

# 全局变量
Network = ()->
	# 全局变量
	container = null
	allData  = null
	width = 0
	height = 800
	img_w = 18
	img_h = 18
	biggerH = 800
	paddingTop = 20
	paddingLeft = 150
	paddinginner = 20
	# y轴坐标的倍数
	multiple = 1
	# 行业标题
	titles = []
	entindustryArr = []
	deepCompany = []
	# 层级
	deepNum = null
	# 列矩阵
	colrects = null
	rowrects =null
	# 所有的点
	nodes = null
	# 所有的线
	links = null
	# 所有的公司名字
	entnames = null
	# 每个公司绘制股东的点
	investments = null
	# 毎列圆的半径的值
	minValue = null
	maxValue = null
	# 每行矩形的高度
	minRectHeight = null
	maxRectHeight = null
	colrectsGroup = null
	rowrectsGroup = null
	nodesGroup = null
	linksGroup = null
	entNameGroup = null
	investmentGroup = null
	# 所有圆的半径的阈值
	widthRange = d3.scale.linear()
		.range([10, 60])
	# 毎列资金的阈值
	heightRange = d3.scale.linear()
	widthValues = d3.map()
	heightValues = d3.map()
	rectWidthValues = d3.map()
	# 存储点的位置
	nodePosition = d3.map()
	shiftValues = d3.map()
	shiftx = paddingLeft
	shifty = 0
	# 将有关系的点存到数组里面
	linkedByIndex = {}
	# 所有列的宽度
	colswidth = 0
	calculateHeight = 0
	color = d3.scale.category20()
	network = (selection, data) ->
		# 处理数据
		allData = data
		setupData(data)
		# 设置资金和圆半径的比例
		widthRange.domain([minValue, maxValue])
			.nice()
		# 计算宽度
		titles.forEach (t)->
			width += widthRange(widthValues.get(t)) * 2 + paddinginner * 2
		width += paddingLeft

		heightRange.range([0, height / deepNum - (height / (deepNum * 5))])
		container = d3.select(selection).append("svg:svg")
			.attr("width", width+200)
			.attr("height", height+200)

		# 添加标题
		appendChartTitle()
		# 添加列矩阵
		appendColRects()
		# 添加行矩阵
		appendRowRects()
		# 添加行业轴
		appendXAxis()
		# 给每个行矩阵添加坐标轴
		appendYAxis()

		# 储存node的坐标信息
		place()
		appendLinks()
		appendNodes()
		# 在公司圆圈里面增加企业的投资金额
		appendEntregcap()
		appendEntname()

	setupData = (data)->
		# 计算一些基本数据
		data.nodes.forEach (n)->
			if titles.indexOf(n.entindustry)<0
				titles.push(n.entindustry)
			# if deeps.indexOf(n.deep)<0
			# 	deeps.push(n.deep)
			if not deepNum or n.deep > deepNum
				deepNum = Number(n.deep)

			if not minValue
				minValue = Number(n.regcap)
			else
				if Number(n.regcap) < minValue
					minValue = Number(n.regcap)
			if not maxValue
				maxValue = Number(n.regcap)
			else
				if Number(n.regcap) > maxValue
					maxValue = Number(n.regcap)
		# 计算列矩阵所需要的深度
		titles.forEach (title)->
			min = null
			max = null
			obj = {}
			obj.entindustry = title
			obj.children = []
			# titlewidth = title.length * 100
			# widthValues.set(title, titlewidth)

			data.nodes.forEach (n)->
				if n.entindustry is title
					obj.children.push(n)
					if not min
						min = Number(n.regcap)
					else
						if Number(n.regcap) < min
							min = Number(n.regcap)
					if not max
						max = Number(n.regcap)
					else
						if Number(n.regcap) > max
							max = Number(n.regcap)
					widthValues.set(title, max)
			obj.minregcap = min
			obj.maxregcap = max
			entindustryArr.push(obj)

		# 计算行矩阵所需要的数据
		for num in [1..deepNum]
			min = null
			max = null
			obj = {}
			obj.deep = num
			obj.children = []
			data.nodes.forEach (n)->
				if Number(n.deep) is num
					obj.children.push(n)
					if not min
						min = Number(n.regcap)
					else
						if Number(n.regcap) < min
							min = Number(n.regcap)
					if not max
						max = Number(n.regcap)
					else
						if Number(n.regcap) > max
							max = Number(n.regcap)
					rowDomain = {}
					rowDomain.min = min
					rowDomain.max = max
					heightValues.set(n.deep, rowDomain)
			obj.minregcap = min
			obj.maxregcap = max
			deepCompany.push(obj)

		# 将和每个点相关的点存到d3.map数组里面
		data.links.forEach (l)->
			linkedByIndex["#{l.entsource}, #{l.enttarget}"] = 1

	appendChartTitle = ()->
		container.append("svg:text")
			.attr("text-anchor", "middle")
			.attr("x", width / 2)
			.attr("y", paddingTop)
			.text("行业投资图")

	appendColRects = ()->

		colrectsGroup = container.append("svg:g")
			.attr("class", "colrects")

		colrects = colrectsGroup.selectAll("g")
			.data(entindustryArr)
			.enter()
			.append("svg:g")
			.attr("transform", (d, i)->
					title = if not i then titles[i] else titles[i - 1]
					r = widthRange(widthValues.get(title))
					w = (r + paddinginner)* 2
					shiftx += if not i then 0 else w
					shiftValues.set(d.entindustry, shiftx)

					# 存储每个点在当前矩阵的中心点
					sorttitle = titles[i]
					sortr = widthRange(widthValues.get(sorttitle))
					sfx = shiftx + sortr + paddinginner
					rectWidthValues.set(d.entindustry, sfx)
					# 根据行业对矩形进行平移
					"translate(#{shiftx}, #{paddingTop * 3})"
					)
			# .attr("fill", (d)-> color(d.entindustry))
			.attr("fill", "#fff")
		colrects.append("svg:text")
			.attr("class", "industrytitle")
			.attr("y", -10)
			.attr("transform", (d)->
				"translate(20) rotate(-10)")
			# .attr("x", (d, i) ->
			# 	title = titles[i]
			# 	# titlew = title.length * 12
			# 	w = widthValues.get(title)
			# 	# widthRange(w) / 2 + titlew / 2
			# 	widthRange(w) / 2
			# 	)
			.attr("fill", "#000")
			.text((d)-> d.entindustry)

		colrects.append("svg:rect")
			.attr("class", "colrect")
			.attr("width", (d)->

				# colswidth += widthRange(d.maxregcap) * 2 + paddinginner * 2
				# realW = widthRange(d.maxregcap) * 2 + paddinginner * 2
				# # rectWidthValues.set(d.entindustry, realW)
				# realW
				)
			.attr("height", height)

		colrects.append("svg:line")
			.attr("class", "colrectline")
			.attr("x1", (d)->
				(widthRange(widthValues.get(d.entindustry)) + paddinginner) * 2
				)
			.attr("y1", 0)
			.attr("x2", (d)-> (widthRange(widthValues.get(d.entindustry)) + paddinginner) * 2)
			.attr("y2", height - paddingTop * 3)

	# 添加行业轴
	appendXAxis = ()->
		container.append("svg:g")
			.attr("class", "x axis")
			.append("svg:line")
			.attr("x1", paddingLeft)
			.attr("y1", paddingTop * 3)
			.attr("x2", width)
			.attr("y2", paddingTop * 3)

	appendRowRects = ()->
		rowrectsGroup = container.append("svg:g")
			.attr("class", "rowrects")

		rowrects = rowrectsGroup.selectAll("g")
			.data(deepCompany)
			.enter()
			.append("svg:g")
			# .attr
			.attr("fill", "#fff")
			.attr("opacity", 0.5)
			.attr("transform", (d)->
				shifty += if d.deep is 1 then paddingTop * 3 else ((height - paddingTop * 3) / deepNum)
				"translate(#{paddingLeft}, #{shifty})"
				)

		rowrects.append("svg:rect")
			.attr("width", colswidth)
			.attr("height", ((height - paddingTop * 3) / deepNum))

		rowrects.append("svg:line")
			.attr("class", "rowrectline")
			.attr("x1", (d)-> 0)
			.attr("y1", (d)-> ((height - paddingTop * 3) / deepNum))
			.attr("x2", width - paddingLeft)
			.attr("y2", (d)-> ((height - paddingTop * 3)  / deepNum))

	appendYAxis = ()->

		rowrects.append("svg:g")
			.attr("class", (d)-> "yaxis yaxis" + d.deep)
		for num in [1..deepNum]
			hmin = heightValues.get(num).min / multiple
			hmax = heightValues.get(num).max / multiple
			heightRange.domain([0, hmax])

			yAxis = d3.svg.axis()
			    .scale(heightRange)
			    .orient("left")
			    .ticks(3)

			rowrectsGroup.select('.yaxis'+num)
				.call(yAxis)

	place = ()->

		allData.nodes.forEach (n)->
			key = n.lcid
			obj = {}
			x = rectWidthValues.get(n.entindustry)

			domainH = heightValues.get(n.deep)
			heightRange.domain([0, domainH.max / multiple])
			needH = ((height - paddingTop * 3) / deepNum) * (Number(n.deep) - 1) + heightRange(Number(n.regcap)/multiple)
			y = needH + paddingTop * 3

			r = widthRange(n.regcap)
			obj.x = x
			obj.y = y
			obj.r = r
			nodePosition.set(key, obj)

	appendNodes = ()->

		nodesGroup = container.append("svg:g")
			.attr("class", "nodes")

		nodes = nodesGroup.selectAll("circle.industrynode")
			.data(allData.nodes)

		nodes.enter().append("circle")
			.attr("class", "industrynode")
			.attr("r", (d)->
				r = widthRange(Number(d.regcap))
				r
				)
			.attr("cx", (d)->
				# rectWidthValues.get(d.entindustry)
				nodePosition.get(d.lcid).x
				)
			.attr("cy", (d)->
				# domainH = heightValues.get(d.deep)
				# heightRange.domain([0, domainH.max / multiple])
				# needH = ((height - paddingTop * 3) / deepNum) * (Number(d.deep) - 1) + heightRange(Number(d.regcap)/multiple)
				# needH + paddingTop * 3
				nodePosition.get(d.lcid).y
				)
			# 点击绘制该点的投资公司或者股东
			.on('click', showDetails)
			# 当鼠标移动到某个企业点上的时候，使和它相关的企业都要高亮
			# .on('mouseover', showDetails)
			# .on('mouseout', hideDetails)
	# 高亮有关系的点
	showDetails = (d, i)->
		hideDetails(d, i)
		nodes.style("stroke-width", (n)->
			if (neighboring(d, n) ) then 5.0 else 1.0
		)
		nodes.style("stroke", (n)->
			if (neighboring(d, n))
				"rgb(200,113,114)"
			else
				"#ddd"
		)
		entnames.style('opacity', (n)->
			if (neighboring(d, n) ) then 1.0 else 0.0
		)
		links.style("stroke-width", (n)->
			if (n.enttarget is d.lcid or n.entsource is d.lcid) then 5.0 else 1.0
		)
		links.style("stroke", (n)->
			if (n.enttarget is d.lcid or n.entsource is d.lcid)
				"rgb(200,113,114)"
			else
				"#ddd"
		)

		center = {}
		center.x = nodePosition.get(d.lcid).x
		center.y = nodePosition.get(d.lcid).y
		center.r = nodePosition.get(d.lcid).r

		# 将已有的投资关系去掉
		clearInvestment = d.investment.filter (invest)->
			!linkedByIndex[invest.entsource + ', ' + invest.enttarget]
		drawInvestment center, clearInvestment

		# 在行业投资图的右侧增加企业基本信息
		content = "<div class='gsmsg'><h4>工商注册信息</h4>"
		content += "<dl><dt class='title'>注册名称</dt><dd class='info'>#{d.entname}</dd></dl>"
		content += "<dl><dt class='title'>经营状况</dt><dd class='info'>#{d.entstatus}</dd></dl>"
		content += "<dl><dt class='title'>成立时间</dt><dd class='info'>#{d.esdate}</dd></dl>"
		content += "<dl><dt class='title'>注册资金</dt><dd class='info'>#{d.regcap}万#{d.regcapcur}</dd></dl>"
		content += "<dl><dt class='title'>注册号</dt><dd class='info'>#{d.regno}</dd></dl>"
		content += "<dl><dt class='title'>法人代表</dt><dd class='info'>#{d.corporation}</dd></dl>"
		content += "<dl><dt class='title'>所处行业</dt><dd class='info'>#{d.entindustry}</dd></dl>"
		content += "<dl><dt class='title'>注册地址</dt><dd class='info'>#{d.oploc}</dd></dl>"
		content += "<dl><dt class='title'>经营地址</dt><dd class='info'>#{d.address}</dd></dl>"
		content += "<dl><dt class='title'>经营范围</dt><dd class='info'>#{d.totalscpoe}</dd></dl>"
		content += "</div>"
		$('#regmsg').append(content)


	hideDetails = (d, i)->
		d3.select('.investments').remove()
		nodes.style("stroke-width", 2.0)
		entnames.style('opacity', 1.0)
		links.style("stroke-width", 1.0)
		nodes.style("stroke", "#ddd")
		links.style("stroke", "#ddd")

		$('#regmsg').html('')

	# 给两个点，然后通过linkedByindex来判断是否有关系
	neighboring = (a, b)->
		linkedByIndex[a.lcid + ', ' + b.lcid] or linkedByIndex[b.lcid + ', ' + a.lcid] or a.lcid is b.lcid

	appendEntregcap = ()->
		entNameGroup = container.append('svg:g')
			.attr('class', 'entregcaps')

		entregcaps = entNameGroup.selectAll("text.entregcap")
			.data(allData.nodes)

		entregcaps.enter().append('text')
			.attr("class", 'entregcap')
			.attr('x', (d)->
				nodePosition.get(d.lcid).x
			)
			.attr('y', (d)->
				nodePosition.get(d.lcid).y
			)
			.attr('transform', (d)->
				entregcapwidth = d.regcap.toString().length * 5
				"translate(#{- entregcapwidth/2}, #{5/2})")
			.text((d)-> d.regcap)
			.on('click', showDetails)
			# .on('mouseover', showDetails)
			# .on('mouseout', hideDetails)
	appendEntname = ()->
		entNameGroup = container.append("svg:g")
			.attr("class", "entnames")

		entnames = entNameGroup.selectAll("text.entname")
			.data(allData.nodes)

		entnames.enter().append('text')
			.attr("class", 'entnametext')
			# .attr('opacity', 0)
			.attr('x', (d)->
				nodePosition.get(d.lcid).x
				)
			.attr('y', (d)->
				nodePosition.get(d.lcid).y
				)
			.attr('transform', (d)->
					entnamewidth = d.entname.length * 10
					# num = [1, -1][Math.round(Math.random())] * (nodePosition.get(d.lcid).r + 10)
					# "translate(#{- entnamewidth/2}, #{num})")
					"translate(#{- entnamewidth/2}, #{-nodePosition.get(d.lcid).r - 10})")
			.text((d)->
				d.entname
				)

	appendLinks = ()->
		linksGroup = container.append("svg:g")
			.attr("class", "links")

		links = linksGroup.selectAll('line.line')
			.data(allData.links)

		links.enter().append('line')
			.attr("class", "industrylink")
			.attr("stroke", "#ddd")
			.attr("x1", (d)->
				if nodePosition.get(d.entsource)
					nodePosition.get(d.entsource).x
				)
			.attr("y1", (d)->
				if nodePosition.get(d.entsource)
					nodePosition.get(d.entsource).y
				)
			.attr("x2", (d)->
				if nodePosition.get(d.enttarget)
					nodePosition.get(d.enttarget).x
				)
			.attr("y2", (d)->
				if nodePosition.get(d.enttarget)
					nodePosition.get(d.enttarget).y
				)
	drawInvestment = (center, investment)->
		# 将其它的投资人移除掉，然后对新的投资人进行绘制
		d3.select('.investments').remove()
		# 第一个点的绘制角度
		startangle = 0
		# 两个圆之间的夹角
		angle = 360 / investment.length
		# 距离点击点的距离
		radius = 100

		# 计算每个投资点与中心点的相对坐标
		radialLocation = (center, angle, radius) ->
		    x = (center.x + radius * Math.cos(angle * Math.PI / 180))
		    y = (center.y + radius * Math.sin(angle * Math.PI / 180))
		    {"x":x,"y":y}
		investment.forEach (obj)->
			coordinate = radialLocation center, startangle, radius
			obj.x = coordinate.x
			obj.y = coordinate.y
			obj.startangle = startangle
			startangle += angle
		investmentGroup = container.append("svg:g")
			.attr("class", "investments")

		investments = investmentGroup.selectAll("g.investment")
			.data(investment)


		investments.enter().append("svg:g")
			.insert('image')
			.attr("class", "investmentimage")
			# .attr('r', 10)
			.attr("width", img_w)
			.attr("height", img_h)
			.attr("x", (d)-> d.x - img_w / 2)
			.attr("y", (d)-> d.y - img_h / 2)
			.attr("xlink:href", (d)->
				if d.entpre.length > 4
					'/img/enterprise.png'
				else
					'/img/grayman.png')

		investments.enter().append("svg:g")
			.insert('a')
			.attr('xlink:href', (d)->
				if d.entsource
					return "/qy/#{d.entsource}/loadqydata"
			)
			.attr('target', '_blank')
			.insert('text')
			.attr("class", "investmentname")
			# .attr('r', 10)
			# .attr("x", (d)-> d.x - d.entpre.length * 10 / 2)
			# .attr("y", (d)-> d.y - img_h / 2 - 10)
			.attr("x", (d)-> d.x)
			.attr("y", (d)-> d.y)
			.attr('transform', (d)->

				if d.startangle > 90 and d.startangle < 270
					return "rotate(#{d.startangle - 180} #{d.x}, #{d.y}) translate(#{-d.entpre.length * 10 - 10})"
				else
					return "rotate(#{d.startangle} #{d.x}, #{d.y}) translate(10)"
			)
			.text((d)-> d.entpre)
		# 增加指向箭头
		investmentGroup.append("defs").append("marker")
			.attr("id", "arrowhead")
			.attr("refX", 4)
			.attr("refY", 2)
			.attr("markerWidth", 6)
			.attr("markerHeight", 4)
			.attr("orient", "auto")
			.append("path")
			.attr("d", "M 0,0 V 4 L6,2 Z")

		investments.selectAll("path")
			.data(investment)
			.enter()
			.append("svg:path")
			.attr("class", "link")
			.attr("d", (d)->
				sidecoordinate = radialLocation(center, d.startangle, center.r + 4)
				"M#{d.x},#{d.y} L#{sidecoordinate.x},#{sidecoordinate.y}"
			)
			.attr("marker-end", "url(#arrowhead)")

		investments.exit().remove()


	return network

industryNetwork = Network()

draw = (data)->
	industryNetwork("#industrychart", data)

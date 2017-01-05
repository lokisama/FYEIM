var p = (new Date).getTime();
function setupLights(e) {
	var t = new mono.PointLight(16777215, .3);
	t.setPosition(-100, 100, 500), e.add(t), e.add(new mono.AmbientLight("white"))
}

function handleClick(e, network) {
	var camera = network.getCamera(),
		interaction = network.getDefaultInteraction(),
		firstClickObject = demo.Default.findFirstObjectByMouse(network, e);
	if (firstClickObject) {
		var element = firstClickObject.element,
			newTarget = firstClickObject.point,
			oldTarget = camera.getTarget();
		if (element.getClient("lazy.function") && element.getClient("validateLicense")) {
			var loader = element.getClient("lazy.function"),
				time1 = (new Date).getTime();
			eval(loader + "()");
			var time2 = (new Date).getTime()
		}
	}
}

function handleDoubleClick(e, network) {
	var camera = network.getCamera(),
		interaction = network.getDefaultInteraction(),
		firstClickObject = demo.Default.findFirstObjectByMouse(network, e);
	if (firstClickObject) {
		var element = firstClickObject.element,
			newTarget = firstClickObject.point,
			oldTarget = camera.getTarget();
		if (element.getClient("lazy.function")) {
			var loader = element.getClient("lazy.function"),
				time1 = (new Date).getTime();
			eval(loader + "()");
			var time2 = (new Date).getTime()
		} else demo.Default.animateCamera(camera, interaction, oldTarget, newTarget)
	} else {
		var oldTarget = camera.getTarget(),
			newTarget = new mono.Vec3(0, 0, 0);
		demo.Default.animateCamera(camera, interaction, oldTarget, newTarget)
	}
}

function loadBuilding1() {
	window.open("#lab/LAB02")
}

function loadBuilding2() {
	window.open("#lab/LAB03")
}
if (!demo) var demo = {};
demo.Default = {
	LAZY_MIN: 10,
	LAZY_MAX: 500,
	CLEAR_COLOR: "#000000",
	_envmaps: {},
	_creators: {},
	_filters: {},
	_templates: {},
	registerCreator: function(e, t) {
		this._creators[e] = t
	},
	getCreator: function(e) {
		return this._creators[e]
	},
	registerFilter: function(e, t) {
		this._filters[e] = t
	},
	getFilter: function(e) {
		return this._filters[e]
	},
	registerTemplates: function(e, t) {
		this._templates[e] = t
	},
	getTemplates: function(e) {
		return this._templates[e]
	},
	setup: function(e) {
		demo.Default.loadImages(["images/outside_lightmap.png", "images/table_shadow.png", "images/conf_table_shadow.png"]);
		var t = new mono.Network3D,
			a = new mono.PerspectiveCamera(30, 1.5, 30, 5e4);
		a.setPosition(1500, 3200, 4e3), t.setCamera(a);
		var m = t.getDefaultInteraction();
		m.yLowerLimitAngle = Math.PI / 180 * 2, m.yUpLimitAngle = Math.PI / 2, m.maxDistance = 3e4, m.minDistance = 50, m.zoomSpeed = 3, m.panSpeed = .2, t.isSelectable = function(e) {
			return !1
		}, document.getElementById(e).appendChild(t.getRootView()), mono.Utils.autoAdjustNetworkBounds(t, document.documentElement, "clientWidth", "clientHeight"), t.getRootView().addEventListener("dblclick", function(e) {
			demo.Default.handleDoubleClick(e, t)
		}), demo.Default.setupLights(t.getDataBox()), demo.Default.loadTempJson();
		var o = ((new Date).getTime(), demo.Default.filterJson(t.getDataBox(), scenceJson.objects));
		demo.Default.loadJson(t, o, scenceJson.clearColor);
		(new Date).getTime()
	},
	setupLights: function(e) {
		var t = new mono.PointLight(16777215, .3);
		t.setPosition(0, 1e3, -1e3), e.add(t);
		var t = new mono.PointLight(16777215, .3);
		t.setPosition(0, 1e3, 1e3), e.add(t);
		var t = new mono.PointLight(16777215, .3);
		t.setPosition(1e3, -1e3, -1e3), e.add(t), e.add(new mono.AmbientLight("white"))
	},
	handleDoubleClick: function(e, t) {
		var a = t.getCamera(),
			m = t.getDefaultInteraction(),
			o = demo.Default.findFirstObjectByMouse(t, e);
		if (o) {
			var i = o.element,
				n = o.point,
				r = a.getTarget();
			if (demo.Default.animateCamera(a, m, r, n, function() {
					i.getClient("animation") && demo.Default.playAnimation(i, i.getClient("animation"))
				}), i.getStyle("lazy.function")) {
				var s = i.getStyle("lazy.function");
				(new Date).getTime();
				s();
				(new Date).getTime()
			}
		} else {
			var r = a.getTarget(),
				n = new mono.Vec3(0, 0, 0);
			demo.Default.animateCamera(a, m, r, n)
		}
	},
	getEnvmap: function(e) {
		return this._envmaps[e]
	},
	setEnvmap: function(e, t) {
		this._envmaps[e] = t
	},
	copyProperties: function(e, t, a) {
		if (e && t)
			for (var m in e) a && a.indexOf(m) >= 0 || (t[m] = e[m])
	},
	createAnnotationObject: function(e) {
		var t = e.translate || [0, 0, 0],
			a = e.label,
			m = e.text,
			o = new mono.Annotation(a, m);
		return o.setPosition(t[0], t[1], t[2]), o
	},
	createCubeObject: function(e) {
		var t = e.translate || [0, 0, 0],
			a = e.width,
			m = e.height,
			o = e.depth,
			i = e.sideColor,
			n = e.topColor,
			r = new mono.Cube(a, m, o);
		return r.setPosition(t[0], t[1] + m / 2, t[2]), r.s({
			"m.color": i,
			"m.ambient": i,
			"left.m.lightmap.image": "./js/3d/eim/room/images/inside_lightmap.png",
			"right.m.lightmap.image": "./js/3d/eim/room/images/outside_lightmap.png",
			"front.m.lightmap.image": "./js/3d/eim/room/images/outside_lightmap.png",
			"back.m.lightmap.image": "./js/3d/eim/room/images/inside_lightmap.png",
			"top.m.color": n,
			"top.m.ambient": n,
			"bottom.m.color": n,
			"bottom.m.ambient": n
		}), r
	},
	createCylinderObject: function(e) {
		var t = e.translate || [0, 0, 0],
			a = e.radius || 10,
			m = e.topRadius || a,
			o = e.bottomRadius || a,
			i = e.height,
			n = e.sideColor || "#A5BDDD",
			r = new mono.Cylinder(m, o, i);
		return r.setPosition(t[0], t[1] + i / 2, t[2]), r.s({
			"m.normalType": mono.NormalTypeSmooth,
			"m.type": "phong",
			"m.color": n,
			"m.ambient": n,
			"side.m.lightmap.image": "./js/3d/eim/room/images/inside_lightmap.png"
		}), r
	},
	createPathObject: function(e) {
		for (var t = e.translate || [0, 0, 0], a = e.width, m = e.height, o = e.data, i = void 0, n = e.insideColor, r = e.outsideColor, s = e.asideColor || r, g = e.zsideColor || r, p = e.topColor, l = e.bottomColor || p, d = e.insideImage, h = e.outsideImage, c = e.topImage, u = e.repeat || e.height, f = 0; f < o.length; f++) {
			var F = o[f];
			i ? i.lineTo(F[0], F[1], 0) : (i = new mono.Path, i.moveTo(F[0], F[1], 0))
		}
		var y = this.createWall(i, a, m, n, r, s, g, p, l, d, h, c, u);
		return y.setPosition(t[0], t[1], -t[2]), y
	},
	createPathNodeObject: function(e) {
		for (var t = e.translate || [0, 0, 0], a = e.scale || [1, 1, 1], m = e.radius || 5, o = void 0, i = e.data, n = e.pathImage, r = e.repeat, s = 0; s < i.length; s++) {
			var g = i[s];
			o ? "c" === g[0] ? o.quadraticCurveTo(g[1], 10, g[2], g[3], 10, g[4]) : o.lineTo(g[0], 10, g[1]) : (o = new mono.Path, o.moveTo(g[0], 10, g[1]))
		}
		var p = this.createPathNode(o, m, n, r, t, a);
		return p
	},
	filterJson: function(e, t) {
		for (var a = [], m = 0; m < t.length; m++) {
			var o = t[m],
				i = o.type,
				n = this.getFilter(i);
			if (n) {
				var r = n(e, o);
				r && (r instanceof Array ? a = a.concat(r) : (this.copyProperties(o, r, ["type"]), a.push(r)))
			} else a.push(o)
		}
		return a
	},
	createCombo: function(e) {
		for (var t = [], a = [], m = [], o = 0; o < e.length; o++) {
			var i = e[o],
				n = i.op || "+",
				r = i.style,
				s = i.client,
				g = (i.translate || [0, 0, 0], i.rotate || [0, 0, 0]),
				p = null;
			if ("path" === i.type && (p = this.createPathObject(i)), "cube" === i.type && (p = this.createCubeObject(i)), "cylinder" === i.type && (p = this.createCylinderObject(i)), "pathNode" === i.type && (p = this.createPathNodeObject(i)), p) {
				if (p.setRotation(g[0], g[1], g[2]), r && p.s(r), s)
					for (var o in s) p.setClient(o, s[o]);
				t.push(p), t.length > 1 && a.push(n), m.push(p.getId())
			}
		}
		if (t.length > 0) {
			var l = new mono.ComboNode(t, a);
			return l.setNames(m), l
		}
		return null
	},
	loadJson: function(e, t, a) {
		var m = e.getDataBox(),
			a = a || demo.Default.CLEAR_COLOR;
		e.setClearColor(a), e.setClearColor(0, 0, 0), e.setClearAlpha(0);
		for (var o, i, n = [], r = [], s = [], g = 0; g < t.length; g++) {
			var p = t[g];
			if (!p.shadowGhost) {
				var l = p.op,
					d = p.style,
					h = p.client,
					c = (p.translate || [0, 0, 0], p.rotate || [0, 0, 0]),
					u = null;
				"path" === p.type && (u = this.createPathObject(p)), "cube" === p.type && (u = this.createCubeObject(p)), "annotation" === p.type && (u = this.createAnnotationObject(p)), "pathNode" === p.type && (u = this.createPathNodeObject(p)), "cylinder" === p.type && (u = this.createCylinderObject(p)), p.shadowHost && (o = u, i = u.getId());
				var f = demo.Default.getCreator(p.type);
				f ? f(m, p) : u && (u.setRotation(c[0], c[1], c[2]), d && u.s(d), h && u.c(h), l ? (n.push(u), n.length > 1 && r.push(l), s.push(u.getId())) : m.add(u))
			}
		}
		if (n.length > 0) {
			var F = new mono.ComboNode(n, r);
			if (F.setNames(s), m.add(F), o && i) {
				var y = function(e, a, m) {
					return function() {
						var o = ((new Date).getTime(), demo.Default.createShadowImage(t, a.getWidth(), a.getDepth())),
							i = m + "-top.m.lightmap.image";
						e.setStyle(i, o);
						(new Date).getTime()
					}
				};
				setTimeout(y(F, o, i), demo.Default.LAZY_MAX)
			}
		}
	},
	loadRackContent: function(e, t, a, m, o, i, n, r, s, g, p) {
		for (var l = 10, d = 9, h = 2, c = !1; l < 200;) {
			var u = "server" + (parseInt(3 * Math.random()) + 1) + ".png",
				f = l > 100 && !c && r ? r.color : null,
				F = this.createServer(e, s, g, u, f);
			if (f && (c = !0), F.setPositionY(l), F.setPositionZ(F.getPositionZ() + 5), "server3.png" === u ? (F.setScaleY(6), l += 6 * d) : l += d, l += h, l > 200) {
				e.remove(F);
				break
			}
		}
	},
	createServer: function(e, t, a, m, o) {
		var i = t.getPositionX(),
			n = t.getPositionZ(),
			r = a.getWidth(),
			s = 8,
			g = a.getDepth(),
			p = new mono.Cube(r, s, g);
		o = o ? o : "#5B6976", p.s({
			"m.color": o,
			"m.ambient": o,
			"m.type": "phong",
			"m.texture.image": "./js/3d/eim/room/images/rack_inside.png"
		}), p.setPosition(i + .5, s / 2, n + (t.getDepth() - p.getDepth()) / 2);
		var l = new mono.Cube(r + 2, s + 1, .5);
		o = o ? o : "#5BA1AF", l.s({
			"m.type": "phong",
			"m.texture.image": "./js/3d/eim/room/images/rack_inside.png",
			"front.m.texture.image": "./js/3d/eim/room/images/" + m,
			"front.m.texture.repeat": new mono.Vec2(1, 1),
			"m.specularStrength": 100,
			"m.color": o,
			"m.ambient": o
		}), l.setPosition(i + .5, (s + 1) / 2, n + p.getDepth() / 2 + (t.getDepth() - p.getDepth()) / 2);
		var d = new mono.ComboNode([p, l], ["+"]);
		return d.setClient("animation", "pullOut.z"), d.setPositionZ(d.getPositionZ() - 5), e.add(d), d
	},
	createWall: function(e, t, a, m, o, i, n, r, s, g, p, l, d) {
		var h = new mono.PathCube(e, t, a);
		return h.s({
			"outside.m.color": o,
			"inside.m.type": "basic",
			"inside.m.color": m,
			"aside.m.color": i,
			"zside.m.color": n,
			"top.m.color": r,
			"bottom.m.color": s,
			"top.m.texture.image": l,
			"bottom.m.texture.image": l,
			"aside.m.texture.image": l,
			"zside.m.texture.image": l,
			"inside.m.texture.image": g,
			"outside.m.texture.image": p,
			"inside.m.lightmap.image": "./js/3d/eim/room/images/inside_lightmap.png",
			"outside.m.lightmap.image": "./js/3d/eim/room/images/outside_lightmap.png",
			"aside.m.lightmap.image": "./js/3d/eim/room/images/outside_lightmap.png",
			"zside.m.lightmap.image": "./js/3d/eim/room/images/outside_lightmap.png",
			"m.transparent": !0,
			"m.side": mono.DoubleSide
		}), h.setRepeat(d), h
	},
	createShadowImage: function(e, t, a) {
		var m = document.createElement("canvas");
		m.width = t, m.height = a;
		var o = m.getContext("2d");
		o.beginPath(), o.rect(0, 0, t, a), o.fillStyle = "white", o.fill();
		var i = !1;
		i && (o.lineWidth = 1, o.strokeStyle = "black", o.stroke());
		for (var n = 0; n < e.length; n++) {
			var r = e[n];
			if (r.floorShadow) {
				var s = r.translate || [0, 0, 0],
					g = r.rotate || [0, 0, 0],
					g = -g[1];
				if ("path" === r.type) {
					var p = t / 2 + s[0],
						l = a - (a / 2 + s[2]),
						d = r.data;
					o.save(), o.translate(p, l), o.rotate(g), o.beginPath();
					for (var h = !0, c = 0; c < d.length; c++) {
						var u = d[c];
						h ? (o.moveTo(u[0], -u[1]), h = !1) : o.lineTo(u[0], -u[1])
					}
					o.lineWidth = r.width, o.strokeStyle = "#C8C8C8", o.shadowColor = "#222222", o.shadowBlur = 60, o.shadowOffsetX = 0, o.shadowOffsetY = 0, o.stroke(), o.restore()
				}
				if ("cube" === r.type) {
					var p = t / 2 + s[0],
						l = a / 2 + s[2],
						f = r.width,
						F = r.depth;
					o.save(), o.translate(p, l), o.rotate(g), o.beginPath(), o.moveTo(-f / 2, 0), o.lineTo(f / 2, 0), o.lineWidth = F, o.strokeStyle = "white", o.shadowColor = "#222222", o.shadowBlur = 60, o.shadowOffsetX = 0, o.shadowOffsetY = 0, o.stroke(), o.restore()
				}
				if ("rack" === r.type || "electric" === r.type) {
					var p = t / 2 + s[0],
						l = a / 2 + s[2],
						f = e.width || 60,
						y = e.height || 200,
						b = e.depth || 80,
						f = .99 * f,
						F = .99 * b;
					o.beginPath(), o.moveTo(p - f / 2, l), o.lineTo(p + f / 2, l), o.lineWidth = F, o.strokeStyle = "black", o.shadowColor = "black", o.shadowBlur = 100, o.shadowOffsetX = 0, o.shadowOffsetY = 0, o.stroke(), o.restore()
				}
				if ("plant" === r.type) {
					var p = t / 2 + s[0],
						l = a / 2 + s[2],
						w = r.scale || [1, 1, 1],
						j = 11 * Math.min(w[0], w[2]);
					o.beginPath(), o.arc(p, l, j, 0, 2 * Math.PI, !1), o.lineWidth = F, o.fillStyle = "black", o.shadowColor = "black", o.shadowBlur = 25, o.shadowOffsetX = 0, o.shadowOffsetY = 0, o.fill(), o.restore()
				}
			} else if (r.shadowImage && demo.Default.loaded) {
				var s = r.translate || [0, 0, 0],
					p = t / 2 + s[0],
					l = a / 2 + s[2],
					g = r.rotate || [0, 0, 0];
				g = -g[1];
				var v = r.shadowImage,
					x = v.src,
					f = v.width || 100,
					y = v.height || 100,
					D = v.xOffset || 0,
					C = v.yOffset || 0;
				o.save(), o.translate(p, l), o.rotate(g), o.globalAlpha = .5, o.shadowColor = "black", o.shadowBlur = 50, o.shadowOffsetX = 0, o.shadowOffsetY = 0;
				var _ = demo.Default.images[x];
				o.drawImage(_, -f / 2 + D, -y / 2 + C, f, y), o.translate(-p, -l), o.restore()
			}
		}
		return m
	},
	createTree: function(e, t, a, m, o, i) {
		var n;
		if (demo.Default._treeInstance) n = demo.Default._treeInstance.clone();
		else {
			var r = 80,
				s = 150,
				g = "./js/3d/eim/images/tree-1.png",
				p = [],
				l = new mono.Cylinder(1, 5, s, 10, 1, (!1), (!1));
			l.s({
				"m.type": "phong",
				"m.color": "#411212",
				"m.ambient": "#411212",
				"m.texture.repeat": new mono.Vec2(10, 4),
				"m.specularmap.image": "./js/3d/eim/room/images/metal_normalmap.jpg",
				"m.normalmap.image": "./js/3d/eim/room/images/metal_normalmap.jpg"
			}), p.push(l);
			for (var d = 5, h = 0; h < d; h++) {
				var c = new mono.Cube(r, s + 20, .01);
				c.s({
					"m.transparent": !0,
					"front.m.visible": !0,
					"front.m.texture.image": g,
					"back.m.visible": !0,
					"back.m.texture.image": g
				}), c.setSelectable(!1), c.setEditable(!1), c.setParent(l), c.setPositionY(20), c.setRotationY(Math.PI * h / d), p.push(c)
			}
			demo.Default._treeInstance = new mono.ComboNode(p), demo.Default._treeInstance.setClient("tree.original.y", l.getHeight() / 2 * o), n = demo.Default._treeInstance
		}
		return n.setPosition(e, n.getClient("tree.original.y") + t, a), n.setScale(m, o, i), n
	},
	createPlant: function(e, t, a, m, o, i) {
		var n;
		if (demo.Default._plantInstance) n = demo.Default._plantInstance.clone();
		else {
			var r = 30,
				s = 30,
				g = "./js/3d/eim/room/images/plant.png",
				p = [],
				l = new mono.Cylinder(.5 * r, .4 * r, 2 * s, 20, 1, (!1), (!1));
			l.s({
				"m.type": "phong",
				"m.color": "#ADADAD",
				"m.ambient": "#ADADAD",
				"m.texture.repeat": new mono.Vec2(10, 4),
				"m.specularmap.image": "./js/3d/eim/room/images/metal_normalmap.jpg",
				"m.normalmap.image": "./js/3d/eim/room/images/metal_normalmap.jpg"
			});
			var d = l.clone();
			d.setScale(.9, 1, .9);
			var h = d.clone();
			h.setScale(.9, .9, .9), h.s({
				"m.type": "phong",
				"m.color": "#163511",
				"m.ambient": "#163511",
				"m.texture.repeat": new mono.Vec2(10, 4)
			});
			var c = new mono.ComboNode([l, d, h], ["-", "+"]);
			p.push(c);
			for (var u = 5, f = 0; f < u; f++) {
				var n = new mono.Cube(2 * r, s + 20, .01);
				n.s({
					"m.transparent": !0,
					"front.m.visible": !0,
					"front.m.texture.image": g,
					"back.m.visible": !0,
					"back.m.texture.image": g
				}), n.setSelectable(!1), n.setEditable(!1), n.setParent(c), n.setPositionY(l.getHeight() / 2 + n.getHeight() / 2 - 20), n.setRotationY(Math.PI * f / u), p.push(n)
			}
			demo.Default._plantInstance = new mono.ComboNode(p), demo.Default._plantInstance.setClient("plant.original.y", l.getHeight() / 2 + l.getHeight() / 4 * Math.min(m, i)), n = demo.Default._plantInstance
		}
		return n.setPosition(e, n.getClient("plant.original.y") + t, a), n.setScale(m, o, i), n
	},
	createPathNode: function(e, t, a, m, o, i) {
		var o = o || [0, 0, 0],
			i = i || [1, 1, 1],
			m = m || new mono.Vec2(1, 1),
			n = new mono.PathNode(e);
		return n.s({
			"m.texture.image": a,
			"m.texture.repeat": m
		}), n.setRadius(t), n.setScale(i[0], i[1], i[2]), n.setPosition(o[0], o[1], o[2]), n
	},
	createShapeNode: function(e, t, a, m, o) {
		var i = new mono.ShapeNode(e);
		return i.s({
			"m.type": "phong",
			"m.color": "#2D2F31",
			"m.ambient": "#2D2F31",
			"m.specular": "#e5e5e5",
			"m.normalmap.image": "./js/3d/eim/room/images/metal_normalmap.jpg",
			"m.texture.repeat": new mono.Vec2(10, 6),
			"m.specularStrength": 3
		}), i.setVertical(!0), i.setAmount(t), i.setPosition(a, m, o), i
	},
	createPathCube: function(e, t, a, m, o, i) {
		var n = new mono.PathCube(e, t, a);
		return n.s({
			"m.type": "phong",
			"m.color": "#2D2F31",
			"m.ambient": "#2D2F31",
			"m.specular": "#e5e5e5",
			"m.normalmap.image": "./js/3d/eim/room/images/metal_normalmap.jpg",
			"m.texture.repeat": new mono.Vec2(10, 6),
			"m.specularStrength": 3
		}), n.setPosition(m, o, i), n
	},
	findFirstObjectByMouse: function(e, t) {
		var a = e.getElementsByMouseEvent(t);
		if (a.length)
			for (var m = 0; m < a.length; m++) {
				var o = a[m],
					i = o.element;
				if (!(i instanceof mono.Billboard)) return o
			}
		return null
	},
	animateCamera: function(e, t, a, m, o) {
		twaver.Util.stopAllAnimates(!0);
		var i = e.getPosition().sub(e.getTarget()),
			n = new twaver.Animate({
				from: 0,
				to: 1,
				dur: 500,
				easing: "easeBoth",
				onUpdate: function(o) {
					var n = a.x + (m.x - a.x) * o,
						r = a.y + (m.y - a.y) * o,
						s = a.z + (m.z - a.z) * o,
						g = new mono.Vec3(n, r, s);
					e.lookAt(g), t.target = g;
					var p = (new mono.Vec3).addVectors(i, g);
					e.setPosition(p)
				}
			});
		n.onDone = o, n.play()
	},
	playAnimation: function(e, t) {
		var a = t.split(".");
		if ("pullOut" === a[0]) {
			var m = a[1];
			demo.Default.animatePullOut(e, m)
		}
		if ("rotate" === a[0]) {
			var o = a[1],
				i = a[2];
			demo.Default.animateRotate(e, o, i)
		}
	},
	animatePullOut: function(e, t) {
		twaver.Util.stopAllAnimates(!0);
		var a = e.getBoundingBox().size().multiply(e.getScale()),
			m = .8,
			o = new mono.Vec3(0, 0, 1),
			i = 0;
		"x" === t && (o = new mono.Vec3(1, 0, 0), i = a.x), "-x" === t && (o = new mono.Vec3((-1), 0, 0), i = a.x), "y" === t && (o = new mono.Vec3(0, 1, 0), i = a.y), "-y" === t && (o = new mono.Vec3(0, (-1), 0), i = a.y), "z" === t && (o = new mono.Vec3(0, 0, 1), i = a.z), "-z" === t && (o = new mono.Vec3(0, 0, (-1)), i = a.z), i *= m, e.getClient("animated") && (o = o.negate());
		var n = e.getPosition().clone();
		e.setClient("animated", !e.getClient("animated")), new twaver.Animate({
			from: 0,
			to: 1,
			dur: 2e3,
			easing: "bounceOut",
			onUpdate: function(t) {
				e.setPosition(n.clone().add(o.clone().multiplyScalar(i * t)))
			}
		}).play()
	},
	animateRotate: function(e, t, a) {
		twaver.Util.stopAllAnimates(!0);
		var m = e.getBoundingBox().size().multiply(e.getScale()),
			o = 0,
			i = 1;
		e.getClient("animated") && (i = -1), e.setClient("animated", !e.getClient("animated"));
		var n, r;
		if ("left" === t) {
			n = new mono.Vec3(-m.x / 2, 0, 0);
			var r = new mono.Vec3(0, 1, 0)
		}
		if ("right" === t) {
			n = new mono.Vec3(m.x / 2, 0, 0);
			var r = new mono.Vec3(0, 1, 0)
		}
		var s = new twaver.Animate({
			from: o,
			to: i,
			dur: 1800,
			easing: "bounceOut",
			onUpdate: function(t) {
				void 0 === this.lastValue && (this.lastValue = 0), e.rotateFromAxis(r.clone(), n.clone(), Math.PI / 180 * a * (t - this.lastValue)), this.lastValue = t
			},
			onDone: function() {
				delete this.lastValue
			}
		});
		s.play()
	},
	getRandomInt: function(e) {
		return parseInt(Math.random() * e)
	},
	getRandomLazyTime: function() {
		var e = demo.Default.LAZY_MAX - demo.Default.LAZY_MIN;
		return demo.Default.getRandomInt(e) + demo.Default.LAZY_MIN
	},
	parseSVG: function(e) {
		return e.loadXml(e)
	},
	loadImages: function(e) {
		function t(t) {
			a++, a >= e.length && (demo.Default.loaded = !0)
		}
		demo.Default.images = {};
		for (var a = 0, m = 0; m < e.length; m++) {
			var o = new Image;
			o.onload = t, o.src = e[m], demo.Default.images[e[m]] = o
		}
	}
}, demo.Default.setupRoomFiled = function(e, t) {
	
	var m = (new Date).getTime();
	console.log("time:  " + (m - p));
	var t = t || new mono.Network3D,
		a = new mono.PerspectiveCamera(30, 1.5, 30, 5e4);
	a.setPosition(632.7, 468, 908.2), t.setCamera(a), a.lookAt(new mono.Vec3(0, 0, 0));
	var m = t.getDefaultInteraction();
	// m.fpsMode = true;
	m.lookSpeed = 6;
	m.yLowerLimitAngle=.4;
	m.yUpLimitAngle=.4;
	m.maxDistance=1500;
	m.minDistance=500;
	m.zoomSpeed=3;
	m.panSpeed=2;
	m.rotateSpeed = 2;
	t.isSelectable = function(e) {
		return !1
	};
	var o = document.getElementById(e);
	o.appendChild(t.getRootView()),
	setTimeout(function() {
		$("#" + e).parent().parent().height($(window).height()-46)
		t.adjustBounds($("#" + e).parent().width(), $("#" + e).parent().parent().height());
	}, 200), 
	$(window).resize(function() {
		t.adjustBounds($("#" + e).parent().width(), $("#" + e).parent().parent().height())
	}), 
	t.getRootView().addEventListener("click", function(e) {
		handleClick(e, t)
	}), t.getRootView().addEventListener("dbclick", function(e) {
		handleDoubleClick(e, t)
	}), setupLights(t.getDataBox());
	
	var i = demo.Default.filterJson(t.getDataBox(), fieldJson.objects);
	demo.Default.loadJson(t, i, fieldJson.clearColor);
	
},demo.Default.registerCreator("plant", function(e, t) {
	var a = t.scale || [2, 2, 2],
		m = (a[0], a[1], a[2], t.delay || !0),
		o = t.translate || [0, 0, 0],
		i = (o[0], o[1], o[2], function(t, a, m, o, i, n) {
			var r = ((new Date).getTime(), demo.Default.createPlant(t, a, m, o, i, n));
			e.add(r);
			(new Date).getTime()
		});
	if (m) {
		var n = function(e, t, a, m, o, n) {
			return function() {
				i(e, t, a, m, o, n)
			}
		};
		setTimeout(n(o[0], o[1], o[2], a[0], a[1], a[2]), demo.Default.getRandomLazyTime())
	} else i(o[0], o[1], o[2], a[0], a[1], a[2])
}), demo.Default.registerCreator("tree", function(e, t) {
	var a = t.scale || [2, 2, 2],
		m = (a[0], a[1], a[2], t.delay || !0),
		o = t.translate || [0, 0, 0],
		i = (o[0], o[1], o[2], function(t, a, m, o, i, n) {
			var r = ((new Date).getTime(), demo.Default.createTree(t, a, m, o, i, n));
			e.add(r);
			(new Date).getTime()
		});
	if (m) {
		var n = function(e, t, a, m, o, n) {
			return function() {
				i(e, t, a, m, o, n)
			}
		};
		setTimeout(n(o[0], o[1], o[2], a[0], a[1], a[2]), demo.Default.getRandomLazyTime())
	} else i(o[0], o[1], o[2], a[0], a[1], a[2])
}), demo.Default.registerFilter("plants", function(e, t) {
	var a = [],
		m = t.translates;
	if (m)
		for (var o = 0; o < m.length; o++) {
			var i = m[o],
				n = {
					type: "plant",
					floorShadow: !1,
					scale: [2, 2, 2],
					translate: i
				};
			demo.Default.copyProperties(t, n, ["type", "translates", "translate"]), a.push(n)
		}
	return a
}), demo.Default.registerFilter("trees", function(e, t) {
	var a = [],
		m = t.translates;
	if (m)
		for (var o = 0; o < m.length; o++) {
			var i = m[o],
				n = {
					type: "tree",
					floorShadow: !0,
					scale: [2, 2, 2],
					translate: i
				};
			demo.Default.copyProperties(t, n, ["type", "translates", "translate"]), a.push(n)
		}
	return a
}),demo.Default.registerFilter("wall", function(e, t) {
	var a = [],
		m = {
			type: "path",
			op: "+",
			width: t.width || 20,
			height: t.height || 200,
			floorShadow: !0,
			insideColor: t.insideColor || "#B8CAD5",
			outsideColor: t.outsideColor || "#A5BDDD",
			asideColor: t.asideColor || "#D6E4EC",
			zsideColor: t.zsideColor || "#D6E4EC",
			topColor: "#D6E4EC",
			bottomColor: t.bottomColor || "red",
			insideImage: t.insideImage,
			outsideImage: t.outsideImage,
			topImage: t.topImage,
			bottomImage: t.bottomImage,
			repeat: t.repeat,
			translate: t.translate,
			data: t.data
		};
	if (a.push(m), t.children) {
		var o = demo.Default.filterJson(e, t.children);
		a = a.concat(o)
	}
	for (var i = [], n = [], r = 0; r < a.length; r++) {
		var s = a[r];
		s.op ? i.push(s) : n.push(s)
	}
	var g = demo.Default.createCombo(i);
	return t.style && g.s(t.style), e.add(g), m.shadowGhost = !0, n.push(m), n
}), demo.Default.registerFilter("building-floor", function(e, t) {
	var a = t.width || 842,
		m = t.depth || 780;
	return [{
		type: "cube",
		width: 290,
		height: 5,
		depth: 190,
		translate: [190, -.5, 310],
		op: "+",
		style: {
			"m.type": "phong",
			"m.texture.image": "./js/3d/eim/images/grass.png",
			"top.m.texture.repeat": new mono.Vec2(10, 10)
		}
	}, {
		type: "cube",
		width: 300,
		height: 5,
		depth: 190,
		translate: [-195, -.5, 310],
		op: "+",
		style: {
			"m.type": "phong",
			"m.texture.image": "./js/3d/eim/images/grass.png",
			"top.m.texture.repeat": new mono.Vec2(10, 10)
		}
	}, {
		type: "cube",
		width: 700,
		height: 5,
		depth: 65,
		translate: [0, -.5, 420],
		rotate: [0, -.08, 0],
		op: "-",
		style: {
			"m.type": "phong",
			"m.texture.image": "./js/3d/eim/images/grass.png",
			"top.m.texture.repeat": new mono.Vec2(10, 10)
		}
	}, {
		type: "cube",
		width: 114,
		height: 5,
		depth: 23,
		translate: [100, 0, 350],
		rotate: [0, .01, 0],
		op: "-",
		style: {
			"m.type": "phong",
			"m.texture.image": "./js/3d/eim/images/grass.png"
		}
	}, {
		type: "cube",
		width: 70,
		height: 5,
		depth: 700,
		translate: [405, -.5, 70],
		op: "+",
		style: {
			"m.type": "phong",
			"m.texture.image": "./js/3d/eim/images/grass.png",
			"top.m.texture.repeat": new mono.Vec2(4, 16)
		}
	}, {
		type: "cube",
		width: 40,
		height: 15,
		depth: 84,
		translate: [390, -.5, 282],
		op: "-",
		style: {
			"m.type": "phong",
			"m.texture.image": "./js/3d/eim/images/grass.png",
			"top.m.texture.repeat": new mono.Vec2(4, 16)
		}
	}, {
		type: "cube",
		width: 56,
		height: 15,
		depth: 130,
		translate: [394, -.5, -200],
		op: "-",
		style: {
			"m.type": "phong",
			"m.texture.image": "./js/3d/eim/images/grass.png",
			"top.m.texture.repeat": new mono.Vec2(4, 16)
		}
	}, {
		type: "cube",
		width: 60,
		height: 5,
		depth: 660,
		translate: [-400, -.5, -80],
		op: "+",
		style: {
			"m.type": "phong",
			"m.texture.image": "./js/3d/eim/images/grass.png",
			"top.m.texture.repeat": new mono.Vec2(4, 16)
		}
	}, {
		type: "cube",
		width: 40,
		height: 5,
		depth: 400,
		translate: [-390, -.5, -80],
		op: "-",
		style: {
			"m.type": "phong",
			"m.texture.image": "./js/3d/eim/images/grass.png",
			"top.m.texture.repeat": new mono.Vec2(4, 16)
		}
	}, {
		type: "cube",
		width: 340,
		height: 5,
		depth: 180,
		translate: [160, -.5, -190],
		op: "+",
		style: {
			"m.type": "phong",
			"m.texture.image": "./js/3d/eim/images/grass.png",
			"top.m.texture.repeat": new mono.Vec2(10, 10)
		}
	}, {
		type: "cube",
		width: a,
		height: 5,
		depth: m,
		translate: [0, -1, 0],
		shadowHost: !0,
		op: "+",
		style: {
			"m.color": "#ffffff",
			"m.ambient": "#ffffff",
			"m.specular": "#FFFFFF",
			"m.type": "phong",
			"m.texture.image": "./js/3d/eim/images/floor.jpg",
			"top.m.texture.repeat": new mono.Vec2(40, 40),
			"m.normalmap.image": "./js/3d/eim/images/floor_normalmap.jpg"
		}
	}, {
		type: "cube",
		width: 330,
		height: 5,
		depth: 400,
		translate: [-285, -1, -700],
		shadowHost: !0,
		op: "+",
		style: {
			"m.color": "#ffffff",
			"m.ambient": "#ffffff",
			"m.specular": "#FFFFFF",
			"m.type": "phong",
			"m.texture.image": "./js/3d/eim/images/floor.jpg",
			"top.m.texture.repeat": new mono.Vec2(30, 30),
			"m.normalmap.image": "./js/3d/eim/images/floor_normalmap.jpg"
		}
	}, {
		type: "cube",
		width: a + 50,
		height: 5,
		depth: 120,
		translate: [0, -1, 500],
		rotate: [0, -.08, 0],
		op: "-",
		shadowHost: !0,
		style: {
			"m.color": "#ffffff",
			"m.ambient": "#ffffff",
			"m.specular": "#FFFFFF",
			"m.type": "phong",
			"m.texture.image": "./js/3d/eim/images/floor.jpg",
			"top.m.texture.repeat": new mono.Vec2(30, 30),
			"m.normalmap.image": "./js/3d/eim/images/floor_normalmap.jpg"
		}
	}, {
		type: "cube",
		width: a,
		height: 5,
		depth: 40,
		translate: [0, 1, -480],
		op: "+",
		shadowHost: !0,
		style: {
			"m.color": "#ffffff",
			"m.ambient": "#ffffff",
			"m.specular": "#FFFFFF",
			"m.type": "phong",
			"m.transparent": !0,
			"m.texture.image": "./js/3d/eim/images/water.jpg",
			"top.m.texture.repeat": new mono.Vec2(30, 1),
			"m.normalmap.image": "./js/3d/eim/images/floor_normalmap.jpg"
		}
	}]
});
var fieldJson = {
	clearColor: "#ddd",
	objects: [{
		type: "cube",
		width: 150,
		height: 46,
		depth: 60,
		sideColor: "#759bc2",
		topColor: "#759bc2",
		translate: [-248, 0, -240],
		style: {
			"m.type": "phong",
			"m.normalScale": new mono.Vec2(.2, .2)
		},
		client: {
			type: "lab",
			id: "LAB03",
			"lazy.function": "loadBuilding2"
		}
	}, {
		type: "cube",
		width: 70,
		height: 46,
		depth: 100,
		sideColor: "#759bc2",
		topColor: "#759bc2",
		translate: [-287, 0, -170],
		style: {
			type: "lab",
			id: "LAB03",
			"m.type": "phong",
			"m.normalScale": new mono.Vec2(.2, .2)
		},
		client: {
			type: "lab",
			id: "LAB03",
			"lazy.function": "loadBuilding2"
		}
	}, {
		type: "cube",
		width: 180,
		height: 40,
		depth: 50,
		sideColor: "#759bc2",
		topColor: "#759bc2",
		translate: [103, 0, -91],
		style: {
			"m.type": "phong",
			"m.normalScale": new mono.Vec2(.2, .2)
		},
		client: {
			type: "lab",
			id: "LAB02",
			"lazy.function": "loadBuilding1"
		}
	}, {
		type: "cube",
		width: 654,
		height: 40,
		depth: 430,
		translate: [0, 0, -60],
		op: "+",
		style: {
			"m.type": "phong",
			"m.color": "#56779e",
			"m.ambient": "#56779e",
			"m.specular": "#56779e",
			"front.m.color": "#aebcc7"
		}
	}, {
		type: "cube",
		width: 16,
		height: 20,
		depth: 100,
		translate: [331, 0, 60],
		op: "+",
		style: {
			"m.type": "phong",
			"m.color": "#56779e",
			"m.ambient": "#56779e",
			"m.specular": "#56779e",
			"front.m.color": "#243040"
		}
	}, {
		type: "cube",
		width: 405,
		height: 20,
		depth: 40,
		translate: [124, 0, -10],
		style: {
			"m.type": "phong",
			"m.color": "#56779e",
			"m.ambient": "#56779e",
			"m.specular": "#56779e"
		}
	}, {
		type: "cube",
		width: 400,
		height: 40,
		depth: 320,
		op: "-",
		translate: [130, 0, -150],
		style: {
			"m.type": "phong",
			"m.color": "#56779e",
			"m.ambient": "#56779e",
			"m.specular": "#56779e",
			"front.m.color": "#5a6f84",
			"left.m.color": "#5a6f84"
		}
	}, {
		type: "cube",
		width: 1,
		height: 5,
		depth: 270,
		translate: [-70, 18, -130],
		op: "-",
		style: {
			"m.type": "phong",
			"m.texture.image": "./js/3d/eim/images/door-grass.png",
			"m.transparent": !0,
			"m.opacity": .8,
			"m.envmap.image": ["./js/3d/eim/images/sky.png", "./js/3d/eim/images/sky.png", "./js/3d/eim/images/sky.png", "./js/3d/eim/images/sky.png", "./js/3d/eim/images/sky.png", "./js/3d/eim/images/sky.png"]
		}
	}, {
		type: "cube",
		width: 652,
		height: 5,
		depth: 145,
		op: "-",
		translate: [0, 40, 82.5],
		rotate: [.05, 0, 0],
		sideColor: "#FFFFFF",
		style: {
			"bottom.m.texture.image": "./js/3d/eim/images/building_top.png",
			"bottom.m.texture.repeat": new mono.Vec2(14, 2),
			"left.m.color": "#6186a8",
			"front.m.color": "#6186a8"
		}
	}, {
		type: "cube",
		width: 652,
		height: 5,
		depth: 145,
		op: "-",
		translate: [0, 40, 82.5],
		rotate: [-.05, 0, 0],
		sideColor: "#FFFFFF",
		style: {
			"bottom.m.texture.image": "./js/3d/eim/images/building_top2.png",
			"bottom.m.texture.repeat": new mono.Vec2(14, 2),
			"left.m.color": "#6186a8",
			"front.m.color": "#6186a8"
		}
	}, {
		type: "cube",
		width: 652,
		height: 5,
		depth: 145,
		op: "-",
		translate: [0, 40, -63.5],
		rotate: [.05, 0, 0],
		sideColor: "#FFFFFF",
		style: {
			"bottom.m.texture.image": "./js/3d/eim/images/building_top.png",
			"bottom.m.texture.repeat": new mono.Vec2(14, 2),
			"left.m.color": "#6186a8",
			"front.m.color": "#6186a8"
		}
	}, {
		type: "cube",
		width: 652,
		height: 5,
		depth: 145,
		op: "-",
		translate: [0, 40, -63.5],
		rotate: [-.05, 0, 0],
		sideColor: "#FFFFFF",
		style: {
			"bottom.m.texture.image": "./js/3d/eim/images/building_top2.png",
			"bottom.m.texture.repeat": new mono.Vec2(14, 2),
			"left.m.color": "#6186a8",
			"front.m.color": "#6186a8",
			"front.m.color": "#6186a8"
		}
	}, {
		type: "cube",
		width: 652,
		height: 5,
		depth: 145,
		op: "-",
		translate: [0, 40, -208],
		rotate: [.05, 0, 0],
		sideColor: "#FFFFFF",
		style: {
			"bottom.m.texture.image": "./js/3d/eim/images/building_top.png",
			"bottom.m.texture.repeat": new mono.Vec2(14, 2),
			"left.m.color": "#6186a8",
			"front.m.color": "#6186a8"
		}
	}, {
		type: "cube",
		width: 652,
		height: 5,
		depth: 145,
		op: "-",
		translate: [0, 40, -208],
		rotate: [-.05, 0, 0],
		sideColor: "#FFFFFF",
		style: {
			"bottom.m.texture.image": "./js/3d/eim/images/building_top2.png",
			"bottom.m.texture.repeat": new mono.Vec2(14, 2),
			"left.m.color": "#6186a8",
			"front.m.color": "#6186a8"
		}
	}, {
		type: "cube",
		width: 329,
		height: 50,
		depth: 146,
		translate: [158, 0, -191],
		op: "+",
		style: {
			"m.type": "phong",
			"m.color": "#bdc9c3",
			"m.ambient": "#bdc9c3",
			"m.specular": "#bdc9c3",
			"right.m.texture.image": "./js/3d/eim/images/building.png",
			"back.m.texture.image": "./js/3d/eim/images/building.png",
			"back.m.texture.repeat": new mono.Vec2(4, 1),
			"right.m.texture.repeat": new mono.Vec2(3, 1)
		}
	}, {
		type: "cube",
		width: 68,
		height: 50,
		depth: 1,
		translate: [288.5, 0, -117.5],
		style: {
			"m.type": "phong",
			"m.color": "#bdc9c3",
			"m.ambient": "#bdc9c3",
			"m.specular": "#bdc9c3",
			"front.m.texture.image": "./js/3d/eim/images/building.png",
			"front.m.texture.repeat": new mono.Vec2(2, 1),
			"right.m.texture.image": "./js/3d/eim/images/building.png",
			"right.m.texture.repeat": new mono.Vec2(.01, 1)
		}
	}, {
		type: "cube",
		width: 309,
		height: 50,
		depth: 100,
		translate: [100, 0, -160],
		op: "-",
		style: {
			"m.texture.image": "./js/3d/eim/images/building.png",
			"m.texture.repeat": new mono.Vec2(6, 1)
		}
	}, {
		type: "cube",
		width: 325,
		height: 4,
		depth: 51,
		translate: [158, 46, -237],
		op: "-",
		style: {
			"bottom.m.texture.image": "./js/3d/eim/images/building_side.png",
			"bottom.m.texture.repeat": new mono.Vec2(40, 6)
		}
	}, {
		type: "cube",
		width: 67,
		height: 4,
		depth: 160,
		translate: [288.5, 46, -182.5],
		op: "-",
		style: {
			"bottom.m.texture.image": "./js/3d/eim/images/building_side.png",
			"bottom.m.texture.repeat": new mono.Vec2(8, 14)
		}
	}, {
		type: "cube",
		width: 20,
		height: 10,
		depth: 20,
		translate: [270, 46, -250],
		op: "+",
		style: {
			"m.type": "phong",
			"m.color": "#bdc9c3",
			"m.ambient": "#bdc9c3",
			"m.specular": "#bdc9c3",
			"bottom.m.texture.image": "./js/3d/eim/images/building_side.png",
			"bottom.m.texture.repeat": new mono.Vec2(8, 14)
		}
	}, {
		type: "cube",
		width: 19,
		height: 3,
		depth: 19,
		translate: [270, 55, -250],
		op: "-",
		style: {
			"m.type": "phong",
			"bottom.m.texture.image": "./js/3d/eim/images/building_side.png",
			"bottom.m.texture.repeat": new mono.Vec2(8, 14)
		}
	}, {
		type: "cube",
		width: 320,
		height: 33,
		depth: 160,
		translate: [160, 0, -140],
		op: "+",
		style: {
			"m.type": "phong",
			"m.texture.image": "./js/3d/eim/images/building.png",
			"m.texture.repeat": new mono.Vec2(8, 1),
			"top.m.texture.repeat": new mono.Vec2(19, 10),
			"top.m.texture.image": "./js/3d/eim/images/building_side.png",
			"m.normalScale": new mono.Vec2(.2, .2),
			"m.reflectRatio": .8
		}
	}, {
		type: "cube",
		width: 120,
		height: 33,
		depth: 100,
		translate: [265, 0, -68],
		op: "-",
		style: {
			"m.type": "phong",
			"m.texture.image": "./js/3d/eim/images/building.png",
			"m.texture.repeat": new mono.Vec2(4, 1),
			"top.m.texture.repeat": new mono.Vec2(4, 1),
			"m.normalmap.image": "./js/3d/eim/images/building_normalmap.png",
			"m.normalScale": new mono.Vec2(.2, .2)
		}
	}, {
		type: "cube",
		width: 320,
		height: 2,
		depth: 160,
		translate: [160, 34, -140],
		op: "+",
		style: {
			"m.texture.image": "./js/3d/eim/images/metal.png",
			"m.transparent": !0,
			"left.m.lightmap.image": "./js/3d/eim/room/images/inside_lightmap.png",
			"right.m.lightmap.image": "./js/3d/eim/room/images/outside_lightmap.png",
			"front.m.lightmap.image": "./js/3d/eim/room/images/outside_lightmap.png",
			"back.m.lightmap.image": "./js/3d/eim/room/images/inside_lightmap.png"
		}
	}, {
		type: "cube",
		width: 120,
		height: 2,
		depth: 100,
		translate: [265, 34, -68],
		op: "-",
		style: {
			"m.texture.image": "./js/3d/eim/images/door-grass.png",
			"m.transparent": !0,
			"m.opacity": 1,
			"m.envmap.image": ["./js/3d/eim/images/sky.png", "./js/3d/eim/images/sky.png", "./js/3d/eim/images/sky.png", "./js/3d/eim/images/sky.png", "./js/3d/eim/images/sky.png", "./js/3d/eim/images/sky.png"]
		}
	}, {
		type: "annotation",
		label: "结构试验室",
		text: "【点击下方进入】结构试验室",
		translate: [100, 60, -80],
		client: {
			type: "lab",
			id: "LAB03",
			"lazy.function": "loadBuilding2"
		}
	}, {
		type: "annotation",
		label: "PS整车排放及性能试验室",
		text: "【点击下方进入】PS整车排放及性能试验室",
		translate: [-310, 70, -130],
		client: {
			type: "lab",
			id: "LAB03",
			"lazy.function": "loadBuilding1"
		}
	}, {
		type: "cube",
		width: 110,
		height: 48,
		depth: 30,
		op: "+",
		translate: [150, 0, 170],
		style: {
			"m.type": "phong",
			"m.texture.image": "./js/3d/eim/images/bdoor.png",
			"m.texture.repeat": new mono.Vec2(.2, 1),
			"front.m.texture.image": "./js/3d/eim/images/bdoor.png",
			"front.m.texture.repeat": new mono.Vec2(1, 1),
			"top.m.texture.image": "./js/3d/eim/images/building_side.png",
			"top.m.texture.repeat": new mono.Vec2(1, 1),
			"left.m.lightmap.image": "./js/3d/eim/room/images/inside_lightmap.png",
			"right.m.lightmap.image": "./js/3d/eim/room/images/outside_lightmap.png",
			"front.m.lightmap.image": "./js/3d/eim/room/images/outside_lightmap.png",
			"back.m.lightmap.image": "./js/3d/eim/room/images/inside_lightmap.png"
		}
	}, {
		type: "cube",
		width: 108,
		height: 1,
		depth: 28,
		op: "-",
		translate: [150.5, 47, 170.5],
		style: {
			"m.color": "#FFFFFF",
			"m.ambient": "#FFFFFF",
			"m.specular": "#FFFFFF",
			"m.type": "phong",
			"m.texture.image": "./js/3d/eim/images/building_side.png",
			"m.texture.repeat": new mono.Vec2(20, 4),
			"front.m.texture.image": "./js/3d/eim/images/building_side.png",
			"front.m.texture.repeat": new mono.Vec2(1, 1),
			"front.m.normalmap.image": "./js/3d/eim/images/bdoor_normalmap.png",
			"front.m.normalScale": new mono.Vec2(.3, .3),
			"left.m.lightmap.image": "./js/3d/eim/room/images/inside_lightmap.png",
			"right.m.lightmap.image": "./js/3d/eim/room/images/outside_lightmap.png",
			"front.m.lightmap.image": "./js/3d/eim/room/images/outside_lightmap.png",
			"back.m.lightmap.image": "./js/3d/eim/room/images/inside_lightmap.png"
		}
	}, {
		type: "cube",
		width: 108,
		height: 48,
		depth: 30,
		op: "+",
		translate: [-150, 0, 170],
		style: {
			"m.color": "#FFFFFF",
			"m.ambient": "#FFFFFF",
			"m.specular": "#FFFFFF",
			"m.type": "phong",
			"m.texture.image": "./js/3d/eim/images/bdoor.png",
			"m.texture.repeat": new mono.Vec2(.2, 1),
			"front.m.texture.image": "./js/3d/eim/images/bdoor.png",
			"front.m.texture.repeat": new mono.Vec2(1, 1),
			"top.m.texture.image": "./js/3d/eim/images/building_side.png",
			"left.m.lightmap.image": "./js/3d/eim/room/images/inside_lightmap.png",
			"right.m.lightmap.image": "./js/3d/eim/room/images/outside_lightmap.png",
			"front.m.lightmap.image": "./js/3d/eim/room/images/outside_lightmap.png",
			"back.m.lightmap.image": "./js/3d/eim/room/images/inside_lightmap.png"
		}
	}, {
		type: "cube",
		width: 108,
		height: 1,
		depth: 28,
		op: "-",
		translate: [-150.5, 47, 170.5],
		style: {
			"m.color": "#FFFFFF",
			"m.ambient": "#FFFFFF",
			"m.specular": "#FFFFFF",
			"m.type": "phong",
			"m.texture.image": "./js/3d/eim/images/building_side.png",
			"m.texture.repeat": new mono.Vec2(20, 4),
			"front.m.texture.image": "./js/3d/eim/images/building_side.png",
			"front.m.texture.repeat": new mono.Vec2(1, 1),
			"front.m.normalmap.image": "./js/3d/eim/images/bdoor_normalmap.png",
			"front.m.normalScale": new mono.Vec2(.3, .3),
			"left.m.lightmap.image": "./js/3d/eim/room/images/inside_lightmap.png",
			"right.m.lightmap.image": "./js/3d/eim/room/images/outside_lightmap.png",
			"front.m.lightmap.image": "./js/3d/eim/room/images/outside_lightmap.png",
			"back.m.lightmap.image": "./js/3d/eim/room/images/inside_lightmap.png"
		}
	}, {
		type: "cube",
		width: 650,
		height: 38,
		depth: 26,
		translate: [0, 0, 168],
		op: "+",
		style: {
			"m.type": "phong",
			"m.color": "#FFFFFF",
			"m.ambient": "#FFFFFF",
			"m.specular": "#FFFFFF",
			"m.texture.image": "./js/3d/eim/images/building_side.png",
			"m.texture.repeat": new mono.Vec2(120, 12),
			"front.m.texture.image": "./js/3d/eim/images/building.png",
			"front.m.texture.repeat": new mono.Vec2(20, 1),
			"right.m.texture.image": "./js/3d/eim/images/building.png",
			"right.m.texture.repeat": new mono.Vec2(2, 1),
			"left.m.texture.image": "./js/3d/eim/images/building.png",
			"left.m.texture.repeat": new mono.Vec2(2, 1),
			"left.m.lightmap.image": "./js/3d/eim/room/images/inside_lightmap.png",
			"right.m.lightmap.image": "./js/3d/eim/room/images/outside_lightmap.png",
			"front.m.lightmap.image": "./js/3d/eim/room/images/outside_lightmap.png",
			"back.m.lightmap.image": "./js/3d/eim/room/images/inside_lightmap.png"
		}
	}, {
		type: "cube",
		width: 648,
		height: 3,
		depth: 24,
		translate: [0, 35, 167.5],
		op: "-",
		style: {
			"m.type": "phong",
			"m.color": "#FFFFFF",
			"m.ambient": "#FFFFFF",
			"m.specular": "#FFFFFF",
			"m.texture.image": "./js/3d/eim/images/building_side.png",
			"m.texture.repeat": new mono.Vec2(120, 6),
			"front.m.texture.image": "./js/3d/eim/images/building_side.png",
			"front.m.texture.repeat": new mono.Vec2(20, 1),
			"right.m.texture.image": "./js/3d/eim/images/building_side.png",
			"right.m.texture.repeat": new mono.Vec2(1, 1),
			"left.m.lightmap.image": "./js/3d/eim/room/images/inside_lightmap.png",
			"right.m.lightmap.image": "./js/3d/eim/room/images/outside_lightmap.png",
			"front.m.lightmap.image": "./js/3d/eim/room/images/outside_lightmap.png",
			"back.m.lightmap.image": "./js/3d/eim/room/images/inside_lightmap.png"
		}
	}, {
		type: "cube",
		width: 130,
		height: 54,
		depth: 80,
		op: "+",
		translate: [-90, 0, -370],
		style: {
			"m.type": "phong",
			"m.color": "#FFFFFF",
			"m.ambient": "#FFFFFF",
			"m.specular": "#FFFFFF",
			"m.texture.image": "./js/3d/eim/images/building_side.png",
			"m.texture.repeat": new mono.Vec2(30, 10)
		}
	}, {
		type: "cube",
		width: 30,
		height: 44,
		depth: 80,
		op: "+",
		translate: [-18, 0, -370],
		style: {
			"m.type": "phong",
			"m.color": "#FFFFFF",
			"m.ambient": "#FFFFFF",
			"m.specular": "#FFFFFF",
			"m.texture.image": "./js/3d/eim/images/building_side.png",
			"m.texture.repeat": new mono.Vec2(30, 10)
		}
	}, {
		type: "cube",
		width: 30,
		height: 66,
		depth: 20,
		op: "+",
		translate: [-78, 0, -339],
		style: {
			"m.type": "phong",
			"m.color": "#ccdfe8",
			"m.ambient": "#ccdfe8",
			"m.specular": "#ccdfe8",
			"m.texture.image": "./js/3d/eim/images/building_side.png",
			"m.texture.repeat": new mono.Vec2(30, 10)
		}
	}, {
		type: "cube",
		width: 129,
		height: 3,
		depth: 79,
		op: "-",
		translate: [-90, 51, -370],
		style: {
			"m.type": "phong",
			"m.color": "#FFFFFF",
			"m.ambient": "#FFFFFF",
			"m.specular": "#FFFFFF",
			"m.texture.image": "./js/3d/eim/images/building_side.png",
			"m.texture.repeat": new mono.Vec2(30, 10)
		}
	}, {
		type: "cube",
		width: 29,
		height: 3,
		depth: 79,
		op: "-",
		translate: [-18, 41, -370],
		style: {
			"m.type": "phong",
			"m.color": "#FFFFFF",
			"m.ambient": "#FFFFFF",
			"m.specular": "#FFFFFF",
			"m.texture.image": "./js/3d/eim/images/building_side.png",
			"m.texture.repeat": new mono.Vec2(30, 10)
		}
	}, {
		type: "cube",
		width: 29,
		height: 1,
		depth: 19,
		op: "-",
		translate: [-78, 65, -339],
		style: {
			"m.type": "phong",
			"m.color": "#ccdfe8",
			"m.ambient": "#ccdfe8",
			"m.specular": "#ccdfe8",
			"m.texture.image": "./js/3d/eim/images/building_side.png",
			"m.texture.repeat": new mono.Vec2(30, 10)
		}
	}, {
		type: "cube",
		width: 130,
		height: 30,
		depth: 50,
		translate: [-273, 0, -380],
		style: {
			"m.type": "phong",
			"m.color": "#FFFFFF",
			"m.ambient": "#FFFFFF",
			"m.specular": "#FFFFFF",
			"m.texture.image": "./js/3d/eim/images/building_side.png",
			"m.texture.repeat": new mono.Vec2(30, 10),
			"left.m.lightmap.image": "./js/3d/eim/room/images/inside_lightmap.png",
			"right.m.lightmap.image": "./js/3d/eim/room/images/outside_lightmap.png",
			"front.m.lightmap.image": "./js/3d/eim/room/images/outside_lightmap.png",
			"back.m.lightmap.image": "./js/3d/eim/room/images/inside_lightmap.png"
		}
	}, {
		type: "cube",
		width: 90,
		height: 34,
		depth: 70,
		op: "+",
		translate: [250, 0, -380],
		style: {
			"m.type": "phong",
			"m.color": "#FFFFFF",
			"m.ambient": "#FFFFFF",
			"m.specular": "#FFFFFF",
			"m.texture.image": "./js/3d/eim/images/building_side.png",
			"m.texture.repeat": new mono.Vec2(30, 8)
		}
	}, {
		type: "cube",
		width: 89,
		height: 10,
		depth: 69,
		op: "-",
		translate: [250, 24, -380],
		style: {
			"m.type": "phong",
			"m.color": "#FFFFFF",
			"m.ambient": "#FFFFFF",
			"m.specular": "#FFFFFF",
			"m.texture.image": "./js/3d/eim/images/building_side.png",
			"m.texture.repeat": new mono.Vec2(30, 8)
		}
	}, {
		type: "cube",
		width: 40,
		height: 34,
		depth: 70,
		translate: [380, 0, -380],
		op: "+",
		style: {
			"m.type": "phong",
			"m.color": "#FFFFFF",
			"m.ambient": "#FFFFFF",
			"m.specular": "#FFFFFF",
			"m.texture.image": "./js/3d/eim/images/building_side.png",
			"m.texture.repeat": new mono.Vec2(30, 8)
		}
	}, {
		type: "cube",
		width: 39,
		height: 10,
		depth: 69,
		translate: [380, 24, -380],
		op: "-",
		style: {
			"m.type": "phong",
			"m.color": "#FFFFFF",
			"m.ambient": "#FFFFFF",
			"m.specular": "#FFFFFF",
			"m.texture.image": "./js/3d/eim/images/building_side.png",
			"m.texture.repeat": new mono.Vec2(30, 8)
		}
	}, {
		type: "cube",
		width: 64,
		height: 24,
		depth: 50,
		translate: [328, 0, -386],
		style: {
			"m.type": "phong",
			"m.color": "#FFFFFF",
			"m.ambient": "#FFFFFF",
			"m.specular": "#FFFFFF",
			"m.texture.image": "./js/3d/eim/images/building_side.png",
			"m.texture.repeat": new mono.Vec2(4, 4),
			"front.m.texture.image": "./js/3d/eim/images/bdoor.png",
			"front.m.texture.repeat": new mono.Vec2(.2, .5)
		}
	}, {
		type: "cube",
		width: 67,
		height: 14,
		depth: 60,
		op: "+",
		translate: [328, 24, -385],
		style: {
			"m.type": "phong",
			"m.color": "#becdd4",
			"m.ambient": "#becdd4",
			"m.specular": "#becdd4",
			"m.texture.image": "./js/3d/eim/images/building_side.png",
			"m.texture.repeat": new mono.Vec2(30, 8)
		}
	}, {
		type: "cube",
		width: 67,
		height: 14,
		depth: 59,
		op: "-",
		translate: [328, 36, -385],
		rotate: [0, 0, .1],
		style: {
			"m.type": "phong",
			"m.color": "#a1c9ed",
			"back.m.color": "#ffffff",
			"m.ambient": "#a1c9ed",
			"m.specular": "#a1c9ed",
			"m.texture.repeat": new mono.Vec2(30, 8)
		}
	}, {
		type: "cube",
		width: 67,
		height: 14,
		depth: 59,
		op: "-",
		translate: [328, 36, -385],
		rotate: [0, 0, -.1],
		style: {
			"m.type": "phong",
			"m.color": "#6483a2",
			"back.m.color": "#ffffff",
			"m.ambient": "#6483a2",
			"m.specular": "#6483a2",
			"m.texture.repeat": new mono.Vec2(30, 8)
		}
	}, {
		type: "cube",
		width: 50,
		height: 50,
		depth: 150,
		op: "+",
		translate: [-400, 0, -330],
		style: {
			"m.type": "phong",
			"m.color": "#FFFFFF",
			"m.ambient": "#FFFFFF",
			"m.specular": "#FFFFFF",
			"m.texture.image": "./js/3d/eim/images/building_side.png",
			"m.texture.repeat": new mono.Vec2(10, 30)
		}
	}, {
		type: "cube",
		width: 49,
		height: 4,
		depth: 149,
		op: "-",
		translate: [-400, 46, -330],
		style: {
			"m.type": "phong",
			"m.color": "#FFFFFF",
			"m.ambient": "#FFFFFF",
			"m.specular": "#FFFFFF",
			"m.texture.image": "./js/3d/eim/images/building_side.png",
			"m.texture.repeat": new mono.Vec2(10, 30)
		}
	}, {
		type: "cube",
		width: 40,
		height: 30,
		depth: 100,
		op: "+",
		translate: [400, 0, 70],
		style: {
			"m.type": "phong",
			"m.color": "#FFFFFF",
			"m.ambient": "#FFFFFF",
			"m.specular": "#FFFFFF",
			"m.texture.image": "./js/3d/eim/images/building_side.png",
			"m.texture.repeat": new mono.Vec2(10, 30),
			"left.m.lightmap.image": "./js/3d/eim/room/images/inside_lightmap.png",
			"right.m.lightmap.image": "./js/3d/eim/room/images/outside_lightmap.png",
			"front.m.lightmap.image": "./js/3d/eim/room/images/outside_lightmap.png",
			"back.m.lightmap.image": "./js/3d/eim/room/images/inside_lightmap.png"
		}
	}, {
		type: "cube",
		width: 40,
		height: 24,
		depth: 70,
		op: "+",
		translate: [400, 0, 190],
		style: {
			"m.type": "phong",
			"m.color": "#FFFFFF",
			"m.ambient": "#FFFFFF",
			"m.specular": "#FFFFFF",
			"m.texture.image": "./js/3d/eim/images/building_side.png",
			"m.texture.repeat": new mono.Vec2(10, 30),
			"left.m.lightmap.image": "./js/3d/eim/room/images/inside_lightmap.png",
			"right.m.lightmap.image": "./js/3d/eim/room/images/outside_lightmap.png",
			"front.m.lightmap.image": "./js/3d/eim/room/images/outside_lightmap.png",
			"back.m.lightmap.image": "./js/3d/eim/room/images/inside_lightmap.png"
		}
	}, {
		type: "cube",
		width: 39,
		height: 3,
		depth: 99,
		op: "-",
		translate: [400, 27, 70],
		style: {
			"m.type": "phong",
			"m.texture.image": "./js/3d/eim/images/building_side.png",
			"m.texture.repeat": new mono.Vec2(10, 30)
		}
	}, {
		type: "cube",
		width: 39,
		height: 3,
		depth: 69,
		op: "-",
		translate: [400, 21, 190],
		style: {
			"m.type": "phong",
			"m.texture.image": "./js/3d/eim/images/building_side.png",
			"m.texture.repeat": new mono.Vec2(10, 30)
		}
	}, {
		type: "cube",
		width: 50,
		height: 66,
		depth: 190,
		op: "+",
		translate: [-168, 0, -668],
		style: {
			"m.type": "phong",
			"m.color": "#a8b9c9",
			"m.ambient": "#a8b9c9",
			"m.specular": "#a8b9c9",
			"front.m.color": "#a8b9c9"
		}
	}, {
		type: "cube",
		width: 100,
		height: 40,
		depth: 300,
		op: "+",
		translate: [-268, 0, -688],
		style: {
			"m.type": "phong",
			"m.color": "#FFFFFF",
			"m.ambient": "#FFFFFF",
			"m.specular": "#FFFFFF",
			"m.texture.image": "./js/3d/eim/images/building_side.png",
			"m.texture.repeat": new mono.Vec2(8, 20)
		}
	}, {
		type: "cube",
		width: 100,
		height: 80,
		depth: 100,
		op: "+",
		translate: [-268, 0, -788],
		style: {
			"m.type": "phong",
			"m.color": "#FFFFFF",
			"m.ambient": "#FFFFFF",
			"m.specular": "#FFFFFF",
			"m.texture.image": "./js/3d/eim/images/building_side.png",
			"m.texture.repeat": new mono.Vec2(8, 20)
		}
	}, {
		type: "cube",
		width: 49,
		height: 10,
		depth: 189,
		op: "-",
		translate: [-168, 64, -668],
		rotate: [0, 0, .15],
		style: {
			"m.type": "phong",
			"m.color": "#88afd8",
			"m.ambient": "#88afd8",
			"m.specular": "#88afd8",
			"back.m.color": "#ffffff",
			"left.m.color": "#ffffff"
		}
	}, {
		type: "cube",
		width: 49,
		height: 10,
		depth: 189,
		op: "-",
		translate: [-168, 64, -668],
		rotate: [0, 0, -.15],
		style: {
			"m.type": "phong",
			"m.color": "#6f92b8",
			"m.ambient": "#6f92b8",
			"m.specular": "#6f92b8",
			"back.m.color": "#ffffff",
			"left.m.color": "#ffffff"
		}
	}, {
		type: "cube",
		width: 99,
		height: 4,
		depth: 299,
		op: "-",
		translate: [-268, 36, -688],
		style: {
			"m.type": "phong",
			"m.color": "#FFFFFF",
			"m.ambient": "#FFFFFF",
			"m.specular": "#FFFFFF",
			"m.texture.image": "./js/3d/eim/images/building_side.png",
			"m.texture.repeat": new mono.Vec2(8, 20)
		}
	}, {
		type: "cube",
		width: 99,
		height: 4,
		depth: 99,
		op: "-",
		translate: [-268, 76, -788],
		style: {
			"m.type": "phong",
			"m.color": "#FFFFFF",
			"m.ambient": "#FFFFFF",
			"m.specular": "#FFFFFF",
			"m.texture.image": "./js/3d/eim/images/building_side.png",
			"m.texture.repeat": new mono.Vec2(8, 20),
			"left.m.lightmap.image": "./js/3d/eim/room/images/inside_lightmap.png",
			"right.m.lightmap.image": "./js/3d/eim/room/images/outside_lightmap.png",
			"front.m.lightmap.image": "./js/3d/eim/room/images/outside_lightmap.png",
			"back.m.lightmap.image": "./js/3d/eim/room/images/inside_lightmap.png"
		}
	}, {
		type: "cube",
		width: 20,
		height: 15,
		depth: 20,
		translate: [0, 0, 309],
		op: "+",
		style: {
			"m.type": "phong",
			"m.texture.image": "./js/3d/eim/images/door-grass.png",
			"m.opacity": .9,
			"m.envmap.image": ["./js/3d/eim/images/sky.png", "./js/3d/eim/images/sky.png", "./js/3d/eim/images/sky.png", "./js/3d/eim/images/sky.png", "./js/3d/eim/images/sky.png", "./js/3d/eim/images/sky.png"]
		}
	}, {
		type: "cylinder",
		height: 15,
		radius: 10,
		translate: [0, 0, 319],
		op: "+",
		style: {
			"m.type": "phong",
			"m.texture.image": "./js/3d/eim/images/door-grass.png",
			"m.opacity": .9,
			"m.envmap.image": ["./js/3d/eim/images/sky.png", "./js/3d/eim/images/sky.png", "./js/3d/eim/images/sky.png", "./js/3d/eim/images/sky.png", "./js/3d/eim/images/sky.png", "./js/3d/eim/images/sky.png"]
		}
	}, {
		type: "cube",
		width: 22,
		height: 15,
		depth: 4,
		translate: [0, 0, 300],
		op: "+",
		style: {
			"m.type": "phong",
			"m.color": "#dbdcd6",
			"m.ambient": "#dbdcd6",
			"m.specular": "#dbdcd6",
			"m.texture.image": "./js/3d/eim/images/building_side.png",
			"m.texture.repeat": new mono.Vec2(4, 6)
		}
	}, {
		type: "cube",
		width: 22,
		height: 3,
		depth: 22,
		translate: [0, 12, 310],
		op: "+",
		style: {
			"m.type": "phong",
			"m.color": "#dbdcd6",
			"m.ambient": "#dbdcd6",
			"m.specular": "#dbdcd6",
			"m.texture.image": "./js/3d/eim/images/building_side.png",
			"m.texture.repeat": new mono.Vec2(4, 6)
		}
	}, {
		type: "cylinder",
		height: 3,
		radius: 11,
		translate: [0, 12, 320],
		op: "+",
		style: {
			"m.type": "phong",
			"m.color": "#dbdcd6",
			"m.ambient": "#dbdcd6",
			"m.specular": "#dbdcd6",
			"m.texture.image": "./js/3d/eim/images/building_side.png",
			"m.texture.repeat": new mono.Vec2(4, 6)
		}
	}, {
		type: "cube",
		width: 20,
		height: 3.5,
		depth: 22,
		translate: [0, 14, 309.5],
		op: "-",
		style: {
			"m.type": "phong",
			"m.color": "#fff",
			"m.ambient": "#fff",
			"m.specular": "#fff",
			"m.texture.image": "./js/3d/eim/images/building_side.png",
			"m.texture.repeat": new mono.Vec2(4, 6)
		}
	}, {
		type: "cylinder",
		height: 3.5,
		radius: 10,
		translate: [0, 14, 320],
		op: "-",
		style: {
			"m.type": "phong",
			"m.color": "#fff",
			"m.ambient": "#fff",
			"m.specular": "#fff",
			"m.texture.image": "./js/3d/eim/images/building_side.png",
			"m.texture.repeat": new mono.Vec2(4, 6)
		}
	}, {
		type: "cube",
		width: 22,
		height: 4,
		depth: 22,
		translate: [0, 3, 310],
		op: "+",
		style: {
			"m.type": "phong",
			"m.color": "#dbdcd6",
			"m.ambient": "#dbdcd6",
			"m.specular": "#dbdcd6",
			"m.texture.image": "./js/3d/eim/images/building_side.png",
			"m.texture.repeat": new mono.Vec2(4, 6)
		}
	}, {
		type: "cylinder",
		height: 4,
		radius: 11,
		translate: [0, 3, 320],
		op: "+",
		style: {
			"m.type": "phong",
			"m.color": "#dbdcd6",
			"m.ambient": "#dbdcd6",
			"m.specular": "#dbdcd6",
			"m.texture.image": "./js/3d/eim/images/building_side.png",
			"m.texture.repeat": new mono.Vec2(4, 6)
		}
	}, {
		type: "cylinder",
		height: 4,
		radius: 50,
		translate: [0, .2, 306],
		op: "+",
		style: {
			"m.type": "phong",
			"m.color": "#FFFFFF",
			"m.ambient": "#FFFFFF",
			"m.specular": "#FFFFFF",
			"m.texture.image": "./js/3d/eim/images/floor-3.jpg",
			"m.texture.repeat": new mono.Vec2(4, 6)
		}
	}, {
		type: "cylinder",
		height: 4,
		radius: 60,
		translate: [150, .2, 226],
		op: "+",
		style: {
			"m.type": "phong",
			"m.color": "#FFFFFF",
			"m.ambient": "#FFFFFF",
			"m.specular": "#FFFFFF",
			"m.texture.image": "./js/3d/eim/images/floor-3.jpg",
			"m.texture.repeat": new mono.Vec2(4, 6)
		}
	}, {
		type: "cylinder",
		height: 4,
		radius: 60,
		translate: [-150, .2, 226],
		op: "+",
		style: {
			"m.type": "phong",
			"m.color": "#FFFFFF",
			"m.ambient": "#FFFFFF",
			"m.specular": "#FFFFFF",
			"m.texture.image": "./js/3d/eim/images/floor-3.jpg",
			"m.texture.repeat": new mono.Vec2(4, 6)
		}
	}, {
		type: "cylinder",
		height: 4,
		radius: 40,
		translate: [-150, 1.2, 206],
		op: "+",
		style: {
			"m.type": "phong",
			"m.color": "#FFFFFF",
			"m.ambient": "#FFFFFF",
			"m.specular": "#FFFFFF",
			"m.texture.image": "./js/3d/eim/images/floor-3.jpg",
			"m.texture.repeat": new mono.Vec2(4, 6)
		}
	}, {
		type: "cylinder",
		height: 1,
		radius: 20,
		translate: [-150, 4.7, 206],
		op: "-",
		style: {
			"m.type": "phong",
			"m.color": "#FFFFFF",
			"m.ambient": "#FFFFFF",
			"m.specular": "#FFFFFF",
			"m.texture.image": "./js/3d/eim/images/grass.png",
			"m.texture.repeat": new mono.Vec2(4, 6)
		}
	}, {
		type: "cube",
		width: 80,
		height: 2,
		depth: 28.5,
		translate: [-150, 4.5, 200],
		op: "-",
		style: {
			"m.type": "phong",
			"m.color": "#FFFFFF",
			"m.ambient": "#FFFFFF",
			"m.specular": "#FFFFFF",
			"m.texture.image": "./js/3d/eim/images/floor-3.jpg",
			"m.texture.repeat": new mono.Vec2(2, 2)
		}
	}, {
		type: "cube",
		width: 28,
		height: 5,
		depth: 30,
		translate: [0, 0, 245],
		sideColor: "#599cbf",
		topColor: "#599cbf",
		scale: [1, 1, 1],
		style: {
			"m.type": "phong",
			"m.normalScale": new mono.Vec2(.2, .2),
			"m.envmap.image": ["./js/3d/eim/images/sky.png", "./js/3d/eim/images/sky.png", "./js/3d/eim/images/sky.png", "./js/3d/eim/images/sky.png", "./js/3d/eim/images/sky.png", "./js/3d/eim/images/sky.png"]
		}
	}, {
		type: "cylinder",
		height: 5,
		radius: 14,
		translate: [0, 0, 260],
		sideColor: "#599cbf",
		topColor: "#599cbf",
		scale: [1, 1, 1],
		style: {
			"m.type": "phong",
			"m.normalScale": new mono.Vec2(.4, .4),
			"m.envmap.image": ["./js/3d/eim/images/sky.png", "./js/3d/eim/images/sky.png", "./js/3d/eim/images/sky.png", "./js/3d/eim/images/sky.png", "./js/3d/eim/images/sky.png", "./js/3d/eim/images/sky.png"]
		}
	}, {
		type: "cylinder",
		height: 5,
		radius: 14,
		translate: [0, 0, 230],
		sideColor: "#599cbf",
		topColor: "#599cbf",
		scale: [1, 1, 1],
		style: {
			"m.type": "phong",
			"m.normalScale": new mono.Vec2(.4, .4),
			"m.envmap.image": ["./js/3d/eim/images/sky.png", "./js/3d/eim/images/sky.png", "./js/3d/eim/images/sky.png", "./js/3d/eim/images/sky.png", "./js/3d/eim/images/sky.png", "./js/3d/eim/images/sky.png"]
		}
	}, {
		type: "building-floor",
		width: 900,
		depth: 1e3
	}, {
		type: "wall",
		width: .1,
		height: 10,
		translate: [0, 4, 0],
		outsideColor: "#fff",
		insideColor: "#fff",
		topColor: "#fff",
		op: "+",
		scale: [1, 1, 1],
		data: [
			[440, -380],
			[430, 450],
			[-440, 450],
			[-440, -300],
			[-360, -300],
			[-360, -320],
			[-70, -332],
			[-70, -322],
			[70, -326],
			[70, -330],
			[170, -330],
			[170, -346],
			[370, -350],
			[440, -380]
		],
		insideImage: "./js/3d/eim/images/blank.png",
		outsideImage: "./js/3d/eim/images/fence2.png",
		topImage: "./js/3d/eim/images/blank.png",
		bottomImage: "./js/3d/eim/images/blank.png"
	}, {
		type: "path",
		width: 20,
		height: 4.6,
		translate: [0, 0, 0],
		outsideColor: "#808387",
		insideColor: "#808387",
		topColor: "#ffffff",
		op: "+",
		scale: [1, 1, 1],
		data: [
			[45, -280],
			[140, -280],
			[200, -310],
			[335.1, -310]
		],
		topImage: "./js/3d/eim/images/floor.jpg",
		repeat: new mono.Vec2(1, 1)
	}, {
		type: "path",
		width: 20,
		height: 4.6,
		translate: [0, 0, 0],
		outsideColor: "#808387",
		insideColor: "#808387",
		topColor: "#ffffff",
		op: "+",
		scale: [1, 1, 1],
		data: [
			[-45, -280],
			[-140, -280],
			[-200, -310],
			[-345, -310]
		],
		topImage: "./js/3d/eim/images/floor.jpg",
		repeat: new mono.Vec2(1, 1)
	}, {
		type: "trees",
		floorShadow: !0,
		scale: [.2, .1, .2],
		translates: [
			[325, 5, 294],
			[310, 5, 294],
			[285, 5, 294],
			[265, 5, 294],
			[235, 5, 294],
			[215, 5, 294],
			[195, 5, 294],
			[155, 5, 272],
			[135, 5, 264],
			[105, 5, 264],
			[325, 5, 330],
			[310, 5, 330],
			[285, 5, 330],
			[265, 5, 330],
			[235, 5, 330],
			[215, 5, 330],
			[195, 5, 330],
			[175, 5, 320],
			[155, 5, 336],
			[135, 5, 336],
			[115, 5, 336],
			[95, 5, 336],
			[80, 5, 336],
			[-245, 5, 320],
			[-225, 5, 320],
			[-205, 5, 320],
			[-185, 5, 320],
			[-155, 5, 320],
			[-135, 5, 320],
			[-115, 5, 320],
			[-80, 5, 320],
			[-50, 5, 218],
			[-70, 5, 218],
			[-90, 5, 218],
			[-110, 5, 218],
			[50, 5, 218],
			[70, 5, 218],
			[90, 5, 218],
			[110, 5, 218]
		]
	}]
};

var demo = {
	LAZY_MIN: 20,
	LAZY_MAX: 100,
	CLEAR_COLOR: "",
	RES_PATH: "./js/plugins/3d/res",
	lastElement: null,
	timer: null,
	network: null,
	setNetwork: function(e) {
		this.network = e
	},
	getNetwork: function() {
		return this.network
	},
	getRes: function(e) {
		return demo.RES_PATH + "/" + e
	},
	getEnvMap: function() {
		if (!demo.defaultEnvmap) {
			demo.defaultEnvmap = [];
			for (var e = demo.getRes("room.jpg"), t = 0; t < 6; t++) demo.defaultEnvmap.push(e)
		}
		return demo.defaultEnvmap
	},
	_creators: {},
	_filters: {},
	_shadowPainters: {},
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
	registerShadowPainter: function(e, t) {
		this._shadowPainters[e] = t
	},
	getShadowPainter: function(e) {
		return this._shadowPainters[e]
	},
	init: function(e, t, o, a, i, n) {
		var r = window.network = new mono.Network3D;
		demo.typeFinder = new mono.QuickFinder(r.getDataBox(), "type", "client"), demo.labelFinder = new mono.QuickFinder(r.getDataBox(), "label", "client"), $("#" + e).html(""), r.setClearColor(0, 0, 0), r.setClearAlpha(0), setTimeout(function() {
			var t = $("#" + e).parent();
			console.log(t.width(), t.height()), r.adjustBounds($("#" + e).parent().width(), $("#" + e).parent().parent().height() - 50)
		}, 20), $(window).resize(function() {
			r.adjustBounds($("#" + e).parent().width(), $("#" + e).parent().parent().height() - 50)
		});
		var l = new mono.PerspectiveCamera(30, 1.5, 30, 3e4);
		r.setCamera(l);
		var s = new mono.DefaultInteraction(r);
		s.yLowerLimitAngle = Math.PI / 180 * 2, s.yUpLimitAngle = Math.PI / 2, s.maxDistance = 2e4, s.minDistance = 50, s.zoomSpeed = 3, s.panSpeed = .2;
		var d = new mono.EditInteraction(r);
		d.setShowHelpers(!0), d.setScaleable(!1), d.setRotateable(!1), d.setTranslateable(!0), r.setInteractions([s, new mono.SelectionInteraction(r), d]), r.isSelectable = function(e) {
			return r.moveView && "rack" === e.getClient("type")
		}, r.editableFunction = function(e) {
			return r.moveView && "rack" === e.getClient("type")
		}, document.getElementById(e).appendChild(r.getRootView()), o = o || 0, a = a || 0, n = n || new Tooltip(["设备名："], ["000000"]), document.body.appendChild(n.getView()), r.getRootView().addEventListener("click", function(e) {
			demo.handleClick(e, r, n)
		}), r.getRootView().addEventListener("dblclick", function(e) {
			demo.handleDoubleClick(e, r)
		}), r.getRootView().addEventListener("mousemove", function(e) {
			demo.handleMouseMove(e, r, n)
		}), demo.setupLights(r.getDataBox());
		var p = (new Date).getTime();
		demo.loadData(r, t);
		var m = (new Date).getTime();
		console.log("time:  " + (m - p)), demo.resetCamera(r, i)
	},
	resetCamera: function(e, t) {
		e.getCamera().setPosition(t.w, t.h, t.d), e.getCamera().lookAt(new mono.Vec3(0, 0, 0))
	},
	dirtyShadowMap: function(e) {
		var t = e.getDataBox().shadowHost,
			o = demo.typeFinder.findFirst("floorCombo");
		demo.updateShadowMap(o, t, t.getId(), e.getDataBox())
	},
	togglePersonVisible: function(e, t) {
		var o = t.getCamera(),
			a = t.getDataBox();
		e ? this.removeObj(a) : this.loadObj(o, a)
	},
	removeObj: function(e) {
		var t = demo.typeFinder.find("person").get(0);
		t.animate.stop(), e.removeByDescendant(t);
		var o = demo.typeFinder.find("trail").get(0);
		e.removeByDescendant(o)
	},
	_playRackDoorAnimate: function(e) {
		var t = demo.labelFinder.findFirst(e),
			o = t.getChildren().get(0);
		o.getClient("animation") && demo.playAnimation(o, o.getClient("animation"))
	},
	loadObj: function(e, t) {},
	createPathAnimates: function(e, t, o, a, i, n) {
		var r = [];
		if (o && o.length > 0) {
			for (var l = t.getPositionX(), s = t.getPositionZ(), d = t.getRotationY(), p = function(e, t, o, a) {
					if (o != a && NaN != o) {
						o - a > Math.PI && (o -= 2 * Math.PI), o - a < -Math.PI && (o += 2 * Math.PI);
						var i = new twaver.Animate({
							from: a,
							to: o,
							type: "number",
							dur: 300 * Math.abs(o - a),
							easing: "easeNone",
							onPlay: function() {
								t.animate = this
							},
							onUpdate: function(e) {
								t.setRotationY(e)
							}
						});
						return i.toAngle = o, i
					}
				}, m = 0; m < o.length; m++) {
				var g = o[m],
					c = g[0],
					h = g[1],
					u = Math.atan2(-(h - s), c - l),
					f = p(e, t, u, d);
				f && (r.push(f), d = f.toAngle);
				var y = new twaver.Animate({
					from: {
						x: l,
						y: s
					},
					to: {
						x: c,
						y: h
					},
					type: "point",
					dur: 5 * Math.sqrt((c - l) * (c - l) + (h - s) * (h - s)),
					easing: "easeNone",
					onPlay: function() {
						t.animate = this
					},
					onUpdate: function(e) {
						t.setPositionX(e.x), t.setPositionZ(e.y)
					}
				});
				r.push(y), l = c, s = h
			}
			if (void 0 != i && d != i) {
				var f = p(e, t, i, d);
				f && r.push(f)
			}
		}
		r[r.length - 1].onDone = n;
		for (var w, m = 0; m < r.length; m++) m > 0 ? (r[m - 1].chain(r[m]), a && m == r.length - 1 && r[m].chain(w)) : w = r[m];
		return w
	},
	toggleConnectionView: function(e) {
		e.connectionView = !e.connectionView;
		var t = e.connectionView,
			o = e.getDataBox(),
			a = demo.typeFinder.find("connection"),
			i = demo.typeFinder.find("rail");
		a.forEach(function(e) {
			if (e.setVisible(t), e.billboard || (e.billboard = new mono.Billboard, e.billboard.s({
					"m.texture.image": demo.createConnectionBillboardImage("0"),
					"m.vertical": !0
				}), e.billboard.setScale(60, 30, 1), e.billboard.setPosition(400, 230, 330), o.add(e.billboard)), e.billboard.setVisible(t), e.isVisible()) {
				var a = new twaver.Animate({
					from: 0,
					to: 1,
					type: "number",
					dur: 1e3,
					repeat: Number.POSITIVE_INFINITY,
					reverse: !1,
					onUpdate: function(t) {
						if (e.s({
								"m.texture.offset": new mono.Vec2(t, 0)
							}), 1 === t) {
							var o = "54" + parseInt(10 * Math.random()) + "." + parseInt(100 * Math.random());
							e.billboard.s({
								"m.texture.image": demo.createConnectionBillboardImage(o)
							})
						}
					}
				});
				a.play(), e.offsetAnimate = a
			} else e.offsetAnimate && e.offsetAnimate.stop()
		}), i.forEach(function(e) {
			e.setVisible(t)
		})
	},
	setupLights: function(e) {
		var t = new mono.PointLight(16711680, 1.5);
		t.setPosition(100, 100, 100), e.add(t);
		var t = new mono.PointLight(65280, 1.3);
		t.setPosition(-200, 200, -200), e.add(t);
		var t = new mono.PointLight(16777215, .3);
		t.setPosition(1e3, -1e3, 1e3), e.add(t), e.add(new mono.AmbientLight("white"))
	},
	handleClick: function(e, t, o) {
		var a = t.getElementsByMouseEvent(e);
		if (a.length > 0) {
			var i = a[0],
				n = i.element,
				r = n.getClient("deviceType"),
				l = n.getClient("id"),
				s = o.getView();
			s.style.display = "none", "lab" == r ? 1 == n.getClient("validateLicense") && window.open("#/" + r + "/" + l) : "BEP" != r && "MTS" != r && "HPU" != r || window.open("#/" + r + "/" + l)
		}
	},
	handleDoubleClick: function(e, t) {
		var o = t.getCamera(),
			a = t.getDefaultInteraction(),
			i = demo.findFirstObjectByMouse(t, e);
		if (i) {
			var n = i.element,
				r = i.point,
				l = o.getTarget();
			if (console.log(n.getClient("animation")), n.getClient("animation")) demo.playAnimation(n, n.getClient("animation"));
			else if (n.getClient("dbl.func")) {
				var s = n.getClient("dbl.func");
				s()
			} else demo.animateCamera(o, a, l, r)
		} else {
			var l = o.getTarget(),
				r = new mono.Vec3(0, 0, 0);
			demo.animateCamera(o, a, l, r)
		}
	},
	handleMouseMove: function(e, t, o) {
		var a = t.getElementsByMouseEvent(e),
			i = null,
			n = o.getView();
		if (a.length) {
			var r = a[0],
				l = r.element;
			l.getClient("isTooltip") && (i = l, 3 == o.keys.length ? o.setValues([l.getClient("name"), l.getClient("status"), l.getClient("faultMsg")]) : 5 == o.keys.length && o.setValues([l.getClient("name"), l.getClient("status"), l.getClient("cycle"), l.getClient("progress"), l.getClient("faultMsg")]))
		}
		demo.lastElement != i && (clearTimeout(demo.timer), i && (demo.timer = setTimeout(function() {
			n.style.display = "block", n.style.position = "absolute", n.style.left = window.lastEvent.pageX - n.clientWidth / 2 + "px", n.style.top = window.lastEvent.pageY - n.clientHeight - 15 + "px"
		}, 100))), demo.lastElement = i, null == i && (n.style.display = "none"), window.lastEvent = e
	},
	copyProperties: function(e, t, o) {
		if (e && t)
			for (var a in e) o && o.indexOf(a) >= 0 || (t[a] = e[a])
	},
	createCubeObject: function(e) {
		var t = e.translate || [0, 0, 0],
			o = e.width,
			a = e.height,
			i = e.depth,
			n = e.sideColor,
			r = e.topColor,
			l = new mono.Cube(o, a, i);
		return l.setPosition(t[0], t[1] + a / 2, t[2]), l.s({
			"m.color": n,
			"m.ambient": n,
			"top.m.color": r,
			"top.m.ambient": r,
			"bottom.m.color": r,
			"bottom.m.ambient": r
		}), l.setClient("type", "rack"), l
	},
	create2DPath: function(e) {
		for (var t, o = 0; o < e.length; o++) {
			var a = e[o];
			t ? t.lineTo(a[0], a[1], 0) : (t = new mono.Path, t.moveTo(a[0], a[1], 0))
		}
		return t
	},
	create3DPath: function(e) {
		for (var t, o = 0; o < e.length; o++) {
			var a = e[o];
			t ? t.lineTo(a[0], a[1], a[2]) : (t = new mono.Path, t.moveTo(a[0], a[1], a[2]))
		}
		return t
	},
	createPathObject: function(e) {
		var t = e.translate || [0, 0, 0],
			o = e.width,
			a = e.height,
			i = e.data,
			n = this.create2DPath(i),
			r = e.insideColor,
			l = e.outsideColor,
			s = e.topColor,
			d = this.createWall(n, o, a, r, l, s);
		return d.setPosition(t[0], t[1], -t[2]), d.shadow = e.shadow, d
	},
	filterJson: function(e, t) {
		for (var o = [], a = 0; a < t.length; a++) {
			var i = t[a],
				n = i.type,
				r = this.getFilter(n);
			if (r) {
				var l = r(e, i);
				l && (l instanceof Array ? o = o.concat(l) : (this.copyProperties(i, l, ["type"]), o.push(l)))
			} else o.push(i)
		}
		return o
	},
	createCombo: function(e) {
		for (var t = [], o = [], a = [], i = 0; i < e.length; i++) {
			var n = e[i],
				r = n.op || "+",
				l = n.style,
				s = (n.translate || [0, 0, 0], n.rotate || [0, 0, 0]),
				d = null;
			"path" === n.type && (d = this.createPathObject(n)), "cube" === n.type && (d = this.createCubeObject(n)), d && (d.setRotation(s[0], s[1], s[2]), l && d.s(l), t.push(d), t.length > 1 && o.push(r), a.push(d.getId()))
		}
		if (t.length > 0) {
			var p = new mono.ComboNode(t, o);
			return p.setNames(a), p
		}
		return null
	},
	loadData: function(e, t) {
		for (var o, a, i = demo.filterJson(e.getDataBox(), t.objects), n = e.getDataBox(), r = [], l = [], s = [], d = 0; d < i.length; d++) {
			var p = i[d],
				m = p.op,
				g = p.style,
				c = p.client,
				h = (p.translate || [0, 0, 0], p.rotate || [0, 0, 0]),
				u = null;
			"path" === p.type && (u = this.createPathObject(p)), "cube" === p.type && (u = this.createCubeObject(p)), p.shadowHost && (o = u, a = u.getId(), n.shadowHost = o);
			var f = demo.getCreator(p.type);
			if (f) f(n, p);
			else if (u) {
				if (u.shadow = p.shadow, u.setRotation(h[0], h[1], h[2]), g && u.s(g), c)
					for (var y in c) u.setClient(y, c[y]);
				m ? (r.push(u), r.length > 1 && l.push(m), s.push(u.getId())) : n.add(u)
			}
		}
		if (r.length > 0) {
			var w = new mono.ComboNode(r, l);
			w.setNames(s), w.setClient("type", "floorCombo"), n.add(w), o && a && setTimeout(function() {
				demo.updateShadowMap(w, o, a, n)
			}, demo.LAZY_MAX)
		}
	},
	updateShadowMap: function(e, t, o, a) {
		var i = demo.createShadowImage(a, t.getWidth(), t.getDepth()),
			n = o + "-top.m.lightmap.image";
		e.setStyle(n, i)
	},
	loadRackContent: function(e, t, o, a, i, n, r, l, s, d, p, m, g) {
		for (var c = 10, h = 2, u = !1; c < n - 20;) {
			var f = parseInt(3 * Math.random()) + 1,
				y = "server" + f + ".jpg";
			3 === f && (y = "server3.png");
			var w = (3 === f || c > 100) && !u && l ? l.color : null,
				b = this.createServer(e, s, d, y, w, g),
				v = b.getBoundingBox().size();
			if (w && (u = !0), b.setPositionY(c + v.y / 2 - n / 2), b.setPositionZ(b.getPositionZ() + 5), b.setParent(m), c = c + v.y + h, c > 200) {
				e.removeByDescendant(b, !0);
				break
			}
		}
	},
	createServer: function(e, t, o, a, i, n) {
		var r = {
				"server1.jpg": 8.89,
				"server2.jpg": 13.335,
				"server3.png": 26.67
			},
			l = (t.getPositionX(), t.getPositionZ(), o.getWidth()),
			s = r[a],
			d = o.getDepth(),
			p = new mono.Cube(l - 2, s - 2, d - 4),
			m = i ? i : "#5B6976";
		p.s({
			"m.color": m,
			"m.ambient": m,
			"m.type": "phong",
			"m.texture.image": demo.getRes("rack_inside.jpg")
		}), p.setPosition(0, .5, (t.getDepth() - p.getDepth()) / 2);
		var g = new mono.Cube(l + 2, s + 1, .5);
		if (i = i ? i : "#FFFFFF", g.s({
				"m.texture.image": demo.getRes("rack_inside.jpg"),
				"front.m.texture.image": demo.RES_PATH + "/" + a,
				"front.m.texture.repeat": new mono.Vec2(1, 1),
				"m.specularStrength": 100,
				"m.transparent": !0,
				"m.color": i,
				"m.ambient": i
			}), g.setPosition(0, 0, p.getDepth() / 2 + (t.getDepth() - p.getDepth()) / 2), "server3.png" == a) {
			var c = "#FFFFFF";
			g.s({
				"m.color": c,
				"m.ambient": c
			})
		}
		var h = new mono.ComboNode([p, g], ["+"]);
		if (h.setClient("animation", "pullOut.z"), h.setPosition(.5, 0, -5), e.add(h), "server3.png" == a)
			for (var u = !1, f = 2.1008, y = .9897, l = l + 2, s = s + 1, w = (l - 2 * f) / 14, b = 14, v = 0; v < b; v++) {
				var x = "#FFFFFF";
				v > 5 && !u && (x = i, u = !0);
				var C = {
						height: s - 2 * y,
						width: w,
						depth: .4 * d,
						pic: demo.RES_PATH + "/card" + (v % 4 + 1) + ".png",
						color: x
					},
					P = demo.createCard(C);
				e.add(P), P.setParent(h), P.setClient("type", "card"), P.setClient("BID", "card-" + v), P.setClient("isAlarm", "#FFFFFF" != x), P.p(-l / 2 + f + (v + .5) * w, -s / 2 + y, g.getPositionZ() - 1), P.setClient("animation", "pullOut.z"), P.getClient("isAlarm") && (n.alarmCard = P)
			}
		return h
	},
	createCard: function(e) {
		var t = e.translate || [0, 0, 0],
			o = t[0],
			a = t[1],
			i = t[2],
			n = e.width || 10,
			r = e.height || 50,
			l = e.depth || 50,
			s = e.rotate || [0, 0, 0],
			d = e.color || "white",
			p = e.pic || demo.getRes("card1.png"),
			m = [{
				type: "cube",
				width: n,
				height: r,
				depth: 1,
				translate: [o, a, i + 1],
				rotate: s,
				op: "+",
				style: {
					"m.color": d,
					"m.ambient": d,
					"m.texture.image": demo.getRes("gray.png"),
					"front.m.texture.image": p,
					"back.m.texture.image": p
				}
			}, {
				type: "cube",
				width: 1,
				height: .95 * r,
				depth: l,
				translate: [o, a, i - l / 2 + 1],
				rotate: s,
				op: "+",
				style: {
					"m.color": d,
					"m.ambient": d,
					"m.texture.image": demo.getRes("gray.png"),
					"left.m.texture.image": demo.getRes("card_body.png"),
					"right.m.texture.image": demo.getRes("card_body.png"),
					"left.m.texture.flipX": !0,
					"m.transparent": !0,
					"m.lightmap.image": demo.getRes("outside_lightmap.jpg")
				}
			}];
		return demo.createCombo(m)
	},
	createShadowImage: function(e, t, o) {
		var a = document.createElement("canvas");
		a.width = t, a.height = o;
		var i = a.getContext("2d");
		i.beginPath(), i.rect(0, 0, t, o), i.fillStyle = "white", i.fill();
		return e.forEach(function(e) {
			if (e instanceof mono.Entity && e.shadow) {
				var a = e.getPosition() || {
						x: 0,
						y: 0,
						z: 0
					},
					n = e.getRotation() || {
						x: 0,
						y: 0,
						z: 0
					},
					n = -n[1];
				demo.paintShadow(e, i, t, o, a, n)
			}
		}), a
	},
	paintShadow: function(e, t, o, a, i, n) {
		var r = e.getClient("type"),
			l = demo.getShadowPainter(r);
		l && l(e, t, o, a, i, n)
	},
	findFirstObjectByMouse: function(e, t) {
		var o = e.getElementsByMouseEvent(t);
		if (o.length)
			for (var a = 0; a < o.length; a++) {
				var i = o[a],
					n = i.element;
				if (!(n instanceof mono.Billboard)) return i
			}
		return null
	},
	animateCamera: function(e, t, o, a, i) {
		var n = e.getPosition().sub(e.getTarget()),
			r = new twaver.Animate({
				from: 0,
				to: 1,
				dur: 500,
				easing: "easeBoth",
				onUpdate: function(i) {
					var r = o.x + (a.x - o.x) * i,
						l = o.y + (a.y - o.y) * i,
						s = o.z + (a.z - o.z) * i,
						d = new mono.Vec3(r, l, s);
					e.lookAt(d), t.target = d;
					var p = (new mono.Vec3).addVectors(n, d);
					e.setPosition(p)
				}
			});
		r.onDone = i, r.play()
	},
	playAnimation: function(e, t, o) {
		var a = t.split(".");
		if ("pullOut" === a[0]) {
			var i = a[1];
			demo.animatePullOut(e, i, o)
		}
		if ("rotate" === a[0]) {
			var n = a[1],
				r = a[2],
				l = a[3];
			demo.animateRotate(e, n, r, l, o)
		}
	},
	animatePullOut: function(e, t, o) {
		var a = e.getBoundingBox().size().multiply(e.getScale()),
			i = .8,
			n = new mono.Vec3(0, 0, 1),
			r = 0;
		"x" === t && (n = new mono.Vec3(1, 0, 0), r = a.x), "-x" === t && (n = new mono.Vec3((-1), 0, 0), r = a.x), "y" === t && (n = new mono.Vec3(0, 1, 0), r = a.y), "-y" === t && (n = new mono.Vec3(0, (-1), 0), r = a.y), "z" === t && (n = new mono.Vec3(0, 0, 1), r = a.z), "-z" === t && (n = new mono.Vec3(0, 0, (-1)), r = a.z), r *= i, e.getClient("animated") && (n = n.negate());
		var l = e.getPosition().clone();
		e.setClient("animated", !e.getClient("animated")), new twaver.Animate({
			from: 0,
			to: 1,
			dur: 2e3,
			easing: "bounceOut",
			onUpdate: function(t) {
				e.setPosition(l.clone().add(n.clone().multiplyScalar(r * t)))
			},
			onDone: function() {
				demo.animationFinished(e), o && o()
			}
		}).play()
	},
	animateRotate: function(e, t, o, a, i) {
		a = a || "easeInStrong";
		var n = e.getBoundingBox().size().multiply(e.getScale()),
			r = 0,
			l = 1;
		e.getClient("animated") && (l = -1), e.setClient("animated", !e.getClient("animated"));
		var s, d;
		if ("left" === t) {
			s = new mono.Vec3(-n.x / 2, 0, 0);
			var d = new mono.Vec3(0, 1, 0)
		}
		if ("right" === t) {
			s = new mono.Vec3(n.x / 2, 0, 0);
			var d = new mono.Vec3(0, 1, 0)
		}
		var p = new twaver.Animate({
			from: r,
			to: l,
			dur: 1500,
			easing: a,
			onUpdate: function(t) {
				void 0 === this.lastValue && (this.lastValue = 0), e.rotateFromAxis(d.clone(), s.clone(), Math.PI / 180 * o * (t - this.lastValue)), this.lastValue = t
			},
			onDone: function() {
				delete this.lastValue, demo.animationFinished(e), i && i()
			}
		});
		p.play()
	},
	animationFinished: function(e) {
		var t = e.getClient("animation.done.func");
		t && t()
	},
	getRandomInt: function(e) {
		return parseInt(Math.random() * e)
	},
	getRandomLazyTime: function() {
		var e = demo.LAZY_MAX - demo.LAZY_MIN;
		return demo.getRandomInt(e) + demo.LAZY_MIN
	},
	generateAssetImage: function(e) {
		var t = 512,
			o = 256,
			a = document.createElement("canvas");
		a.width = t, a.height = o;
		var i = a.getContext("2d");
		return i.fillStyle = "white", i.fillRect(0, 0, t, o), i.font = '150px "Microsoft Yahei" ', i.fillStyle = "black", i.textAlign = "center", i.textBaseline = "middle", i.fillText(e, t / 2, o / 2), i.strokeStyle = "black", i.lineWidth = 15, i.strokeText(e, t / 2, o / 2), a
	},
	toggleTemperatureView: function(e) {
		e.temperatureView = !e.temperatureView, e.getDataBox().forEach(function(t) {
			var o = t.getClient("type");
			if (("rack" === o || "rack.door" === o) && (t.setVisible(!e.temperatureView), "rack" === o)) {
				if (!t.temperatureFake) {
					var a = new mono.Cube(t.getWidth(), t.getHeight(), t.getDepth());
					t.temperatureFake = a;
					var i = demo.createSideTemperatureImage(t, 3 + 10 * Math.random());
					a.s({
						"m.texture.image": i,
						"top.m.texture.image": t.getStyle("top.m.texture.image"),
						"top.m.normalmap.image": demo.getRes("metal_normalmap.jpg"),
						"top.m.specularmap.image": t.getStyle("top.m.texture.image"),
						"top.m.envmap.image": demo.getEnvMap(),
						"top.m.type": "phong"
					}), e.getDataBox().add(a)
				}
				t.temperatureFake.setPosition(t.getPosition()), t.temperatureFake.setVisible(e.temperatureView)
			}
		}), e.temperatureView ? (demo.createTemperatureBoard(e.getDataBox()), demo.createTemperatureWall(e.getDataBox())) : (e.getDataBox().remove(e.getDataBox().temperaturePlane), delete e.getDataBox().temperaturePlane, e.getDataBox().remove(e.getDataBox().temperatureWall), delete e.getDataBox().temperatureWall)
	},
	createTemperatureBoard: function(e) {
		var t = e.shadowHost,
			o = new TemperatureBoard(512, 512, "h", 20);
		e.forEach(function(e) {
			var a = e.getClient("type");
			if ("rack" === a) {
				var i = e.getPositionX() / t.getWidth() * 512 + 256,
					n = e.getPositionZ() / t.getDepth() * 512 + 256,
					r = .1 + .3 * Math.random(),
					l = e.getWidth() / t.getWidth() * 512,
					s = e.getDepth() / t.getWidth() * 512;
				o.addPoint(i - l / 2, n + s / 2, r), o.addPoint(i + l / 2, n + s / 2, r), o.addPoint(i - l / 2, n - s / 2, r), o.addPoint(i + l / 2, n - s / 2, r), o.addPoint(i, n, r)
			}
		});
		var a = o.getImage(),
			i = new mono.Plane(t.getWidth(), t.getDepth());
		i.s({
			"m.texture.image": a,
			"m.transparent": !0,
			"m.side": mono.DoubleSide,
			"m.type": "phong"
		}), i.setPositionY(10), i.setRotationX(-Math.PI / 2), e.add(i), e.temperaturePlane = i
	},
	createTemperatureWall: function(e) {
		var t = new mono.Cube(990, 200, 10);
		t.s({
			"m.visible": !1
		}), t.s({
			"front.m.visible": !0,
			"m.texture.image": demo.getRes("temp1.jpg"),
			"m.side": mono.DoubleSide,
			"m.type": "phong"
		}), t.setPosition(0, t.getHeight() / 2, 400), t.setRotationX(Math.PI), e.add(t), e.temperatureWall = t
	},
	createSideTemperatureImage: function(e, t) {
		for (var o = 2, a = e.getHeight(), i = a / t, n = new TemperatureBoard(o, a, "v", a / t), r = 0; r < t; r++) {
			var l = .3 + .2 * Math.random();
			l < 4 && (l = .9 * Math.random()), n.addPoint(o / 2, i * r, l)
		}
		return n.getImage()
	},
	toggleSpaceView: function(e) {
		e.spaceView = !e.spaceView, e.getDataBox().forEach(function(t) {
			var o = t.getClient("type");
			if (("rack" === o || "rack.door" === o) && (t.setVisible(!e.spaceView), "rack" === o)) {
				t.spaceCubes || (t.spaceCubes = demo.createRackSpaceCubes(e.getDataBox(), t));
				for (var a = 0; a < t.spaceCubes.length; a++) t.spaceCubes[a].setPosition(t.getPositionX(), t.spaceCubes[a].getPositionY(), t.getPositionZ()), t.spaceCubes[a].setVisible(e.spaceView)
			}
		})
	},
	createRackSpaceCubes: function(e, t) {
		for (var o = [], a = t.getWidth(), i = t.getHeight(), n = t.getDepth(), r = 42, l = i / r, s = 0, d = ["#8A0808", "#088A08", "#088A85", "#6A0888", "#B18904"], p = !1; s < 42;) {
			var m = parseInt(1 + 5 * Math.random());
			p = !p;
			var g = p ? d[m - 1] : "#A4A4A4";
			m *= p ? 2 : 4, s + m > r && (m = r - s);
			var c = new mono.Cube(a, l * m - 2, n),
				h = (s + m / 2) * l;
			c.setPosition(t.getPositionX(), h, t.getPositionZ()), c.s({
				"m.type": "phong",
				"m.color": g,
				"m.ambient": g,
				"m.specularStrength": 50
			}), p && c.s({
				"m.transparent": !0,
				"m.opacity": .6
			}), e.add(c), o.push(c), s += m
		}
		return o
	},
	toggleUsageView: function(e) {
		e.usageView = !e.usageView, e.getDataBox().forEach(function(t) {
			var o = t.getClient("type");
			if (("rack" === o || "rack.door" === o) && (t.setVisible(!e.usageView), "rack" === o)) {
				if (!t.usageFakeTotal) {
					var a = Math.random(),
						i = demo.getHSVColor(.7 * (1 - a), .7, .7),
						n = new mono.Cube(t.getWidth(), t.getHeight(), t.getDepth());
					t.usageFakeTotal = n, n.s({
						"m.wireframe": !0,
						"m.transparent": !0,
						"m.opacity": .2
					}), n.setPosition(t.getPosition()), e.getDataBox().add(n);
					var r = t.getHeight() * a,
						l = new mono.Cube(t.getWidth(), 0, t.getDepth());
					t.usageFakeUsed = l, l.s({
						"m.type": "phong",
						"m.color": i,
						"m.ambient": i,
						"m.specularStrength": 20,
						"left.m.lightmap.image": demo.getRes("inside_lightmap.jpg"),
						"right.m.lightmap.image": demo.getRes("inside_lightmap.jpg"),
						"back.m.lightmap.image": demo.getRes("inside_lightmap.jpg"),
						"front.m.lightmap.image": demo.getRes("inside_lightmap.jpg")
					}), l.setPosition(t.getPosition()), l.setPositionY(0), e.getDataBox().add(l);
					var s = new twaver.Animate({
						from: 0,
						to: r,
						type: "number",
						dur: 2e3,
						delay: 200 * Math.random(),
						easing: "bounceOut",
						onUpdate: function(e) {
							l.setHeight(e), l.setPositionY(l.getHeight() / 2)
						}
					});
					t.usageAnimation = s
				}
				t.usageFakeTotal.setVisible(e.usageView), t.usageFakeUsed.setVisible(e.usageView), t.usageFakeTotal.setPosition(t.getPosition().clone()), t.usageFakeUsed.setHeight(0), t.usageFakeUsed.setPosition(t.getPosition().clone()), t.usageFakeUsed.setPositionY(0), e.usageView ? t.usageAnimation.play() : t.usageAnimation.stop()
			}
		})
	},
	toggleAirView: function(e) {
		e.airView = !e.airView, e.getDataBox().airPlanes || (e.getDataBox().airPlanes = demo.createAirPlanes());
		for (var t = 0; t < e.getDataBox().airPlanes.length; t++) {
			var o = e.getDataBox().airPlanes[t];
			e.airView ? (e.getDataBox().add(o), o.airAnimation.play()) : (e.getDataBox().remove(o), o.airAnimation.stop())
		}
	},
	toggleMoveView: function(e) {
		e.getDataBox().getSelectionModel().clearSelection(), e.moveView = !e.moveView, e.dirtyNetwork()
	},
	getHSVColor: function(e, t, o) {
		var a, i, n, r, l, s, d, p;
		switch (e && void 0 === t && void 0 === o && (t = e.s, o = e.v, e = e.h), r = Math.floor(6 * e), l = 6 * e - r, s = o * (1 - t), d = o * (1 - l * t), p = o * (1 - (1 - l) * t), r % 6) {
			case 0:
				a = o, i = p, n = s;
				break;
			case 1:
				a = d, i = o, n = s;
				break;
			case 2:
				a = s, i = o, n = p;
				break;
			case 3:
				a = s, i = d, n = o;
				break;
			case 4:
				a = p, i = s, n = o;
				break;
			case 5:
				a = o, i = s, n = d
		}
		var m = "#" + this.toHex(255 * a) + this.toHex(255 * i) + this.toHex(255 * n);
		return m
	},
	toHex: function(e) {
		var t = parseInt(e).toString(16);
		return 1 == t.length && (t = "0" + t), t
	},
	showDialog: function(e, t, o, a) {
		t = t || "", o = o || 600, a = a || 400;
		var i = document.getElementById("dialog");
		i && document.body.removeChild(i), i = document.createElement("div"), i.setAttribute("id", "dialog"), i.style.display = "block", i.style.position = "absolute", i.style.left = "100px", i.style.top = "100px", i.style.width = o + "px", i.style.height = a + "px", i.style.background = "rgba(164,186,223,0.75)", i.style["border-radius"] = "5px", document.body.appendChild(i);
		var n = document.createElement("span");
		n.style.display = "block", n.style.color = "white", n.style["font-size"] = "13px", n.style.position = "absolute", n.style.left = "10px", n.style.top = "2px", n.innerHTML = t, i.appendChild(n);
		var r = document.createElement("img");
		r.style.position = "absolute", r.style.right = "4px", r.style.top = "4px", r.setAttribute("src", demo.getRes("close.png")), r.onclick = function() {
			document.body.removeChild(i)
		}, i.appendChild(r), e && (e.style.display = "block", e.style.position = "absolute", e.style.left = "3px", e.style.top = "24px", e.style.width = o - 6 + "px", e.style.height = a - 26 + "px", i.appendChild(e))
	},
	showVideoDialog: function(e) {
		var t = document.createElement("video");
		t.setAttribute("src", demo.getRes("test.mp4")), t.setAttribute("controls", "true"), t.setAttribute("autoplay", "true"), demo.showDialog(t, e, 610, 280)
	},
	createConnectionBillboardImage: function(e) {
		var t = 512,
			o = 256,
			a = "当前网络流量",
			i = document.createElement("canvas");
		i.width = t, i.height = o;
		var n = i.getContext("2d");
		n.fillStyle = "#FE642E", n.fillRect(0, 0, t, o - o / 6), n.beginPath(), n.moveTo(.2 * t, 0), n.lineTo(t / 2, o), n.lineTo(.8 * t, 0), n.fill();
		var r = "white";
		n.font = '40px "Microsoft Yahei" ', n.fillStyle = r, n.textAlign = "left", n.textBaseline = "middle", n.fillText(a, o / 10, o / 5);
		var r = "white";
		return a = e, n.font = '100px "Microsoft Yahei" ', n.fillStyle = r, n.textAlign = "left", n.textBaseline = "middle", n.fillText(a, o / 10, o / 2), n.strokeStyle = r, n.lineWidth = 4, n.strokeText(a, o / 10, o / 2), a = "Mb/s", n.font = '50px "Microsoft Yahei" ', n.fillStyle = r, n.textAlign = "right", n.textBaseline = "middle", n.fillText(a, t - o / 10, o / 2 + 20), i
	},
	inspection: function(e) {
		var t, o, a;
		e.getDataBox().forEach(function(e) {
			"left-door" === e.getClient("type") && (t = e), "right-door" === e.getClient("type") && (o = e), "1A04" === e.getClient("label") && (a = e)
		});
		var i = [{
				px: 2e3,
				py: 500,
				pz: 2e3,
				tx: 0,
				ty: 0,
				tz: 0
			}, {
				px: 2e3,
				pz: -2e3
			}, {
				px: 0,
				pz: -2500
			}, {
				px: -2e3
			}, {
				px: -2500,
				pz: 0
			}, {
				pz: 2e3
			}, {
				px: -1200,
				tx: -350,
				ty: 170,
				tz: 500
			}, {
				px: -550,
				py: 190,
				pz: 1100
			}],
			n = [{
				px: -350,
				py: 120,
				pz: 600,
				tx: -340,
				ty: 150,
				tz: -300
			}, {
				py: 100,
				pz: 200
			}, {
				px: -300,
				py: 300,
				pz: 150,
				ty: 70
			}],
			r = function(t) {
				var o = t.alarmCard,
					a = o.getWorldPosition(),
					i = [{
						px: a.x,
						py: a.y,
						pz: a.z + 120,
						tx: a.x,
						ty: a.y + 10,
						tz: a.z
					}, {
						px: a.x - 30,
						py: a.y + 30,
						pz: a.z + 90,
						ty: a.y + 15
					}];
				mono.AniUtil.playInspection(e, i, function() {
					demo.playAnimation(o, o.getClient("animation"), function() {
						e.inspecting = !1, demo.showAlarmDialog()
					})
				})
			};
		a.setClient("loaded.func", r);
		var l = function() {
			demo.playAnimation(t, t.getClient("animation"), function() {
				mono.AniUtil.playInspection(e, n, function() {
					var e = a.door;
					demo.playAnimation(e, e.getClient("animation"))
				})
			}), demo.playAnimation(o, o.getClient("animation"))
		};
		mono.AniUtil.playInspection(e, i, l)
	},
	showAlarmDialog: function() {
		var e = document.createElement("span");
		e.style["background-color"] = "rgba(255,255,255,0.85)", e.style.padding = "10px", e.style.color = "darkslategrey", e.innerHTML = "<b>告警描述</b><p>中兴S330板卡有EPE1，LP1，OL16，CSB,SC，EPE1（2M电口）与LP1（155M光）与用户路由器连接。EPE1上发生TU-AIS ,TU-LOP，UNEQ，误码秒告警，所配业务均出现，用户路由器上出现频繁up，down告警。用户路由器上与1块LP1（有vc12级别的交叉）连接的cpos板卡上也有频繁up，down告警，与另一块LP1（vc4穿通）连接的cpos卡上无告警</p><b>故障分析</b><p>情况很多。如果只是单站出现，首先判断所属环上保护，主用光路有没有告警；如果有，解决主用线路问题；如果没有，做交叉板主备切换--当然是在晚上进行；很少出现主备交叉板都坏的情况。还没解决的话，依次检查单板和接口板。</p>", demo.showDialog(e, "SDH 2M支路板告警", 510, 250), e.style.width = "484px", e.style.height = "203px"
	},
	toggleLinkVisible: function(e) {},
	resetView: function(e) {
		demo.resetCamera(e);
		var t = [];
		e.getDataBox().forEach(function(e) {
			"rack" === e.getClient("type") && e.oldRack && t.push(e)
		});
		for (var o = 0; o < t.length; o++) {
			var a = t[o],
				i = a.oldRack;
			a.alarm && e.getDataBox().getAlarmBox().remove(a.alarm), e.getDataBox().removeByDescendant(a, !0), e.getDataBox().add(i), i.alarm && e.getDataBox().getAlarmBox().add(i.alarm), i.door.setParent(i), i.setClient("loaded", !1);
			var n = i.door;
			e.getDataBox().add(n), n.getClient("animated") && demo.playAnimation(n, n.getClient("animation"))
		}
		var r = [];
		e.getDataBox().forEach(function(e) {
			"left-door" !== e.getClient("type") && "right-door" !== e.getClient("type") || r.push(e)
		});
		for (var o = 0; o < r.length; o++) {
			var n = r[o];
			n.getClient("animated") && demo.playAnimation(n, n.getClient("animation"))
		}
		e.temperatureView && demo.toggleTemperatureView(e), e.spaceView && demo.toggleSpaceView(e), e.usageView && demo.toggleUsageView(e), e.airView && demo.toggleAirView(e), e.moveView && demo.toggleMoveView(e), e.connectionView && demo.toggleConnectionView(e), e.smokeView && demo.toggleSmokeView(e), e.waterView && demo.toggleWaterView(e), e.laserView && demo.toggleLaserView(e), e.powerView && demo.togglePowerView(e)
	},
	resetRackPosition: function(e) {
		e.getDataBox().forEach(function(e) {
			"rack" === e.getClient("type") && e.setPosition(e.getClient("origin"))
		}), demo.dirtyShadowMap(e)
	},
	showDoorTable: function() {},
	toggleSmokeView: function(e) {
		e.smokeView = !e.smokeView, e.getDataBox().forEach(function(t) {
			var o = t.getClient("type");
			"smoke" !== o && "extinguisher_arrow" !== o || t.setVisible(e.smokeView)
		})
	},
	startSmokeAnimation: function(e) {
		setInterval(demo.updateSmoke(e), 200)
	},
	startFpsAnimation: function(e) {
		var t = document.createElement("span");
		t.style.display = "block", t.style.color = "white", t.style["font-size"] = "10px", t.style.position = "absolute", t.style.left = "10px", t.style.top = "10px", t.style.visibility = "hidden", document.body.appendChild(t), e.fpsDiv = t, demo.fps = 0, e.setRenderCallback(function() {
			demo.fps++
		}), setInterval(demo.updateFps(e), 1e3)
	},
	toggleFpsView: function(e) {
		e.fpsView = !e.fpsView, e.fpsView ? e.fpsDiv.style.visibility = "inherit" : e.fpsDiv.style.visibility = "hidden"
	},
	updateSmoke: function(e) {
		return function() {
			e.smokeView && e.getDataBox().forEach(function(t) {
				if ("smoke" === t.getClient("type") && t.isVisible()) {
					for (var o = t, a = o.vertices.length, i = 0; i < a; i++) {
						var n = o.vertices[i];
						n.y = 200 * Math.random(), n.x = Math.random() * n.y / 2 - n.y / 4, n.z = Math.random() * n.y / 2 - n.y / 4
					}
					o.verticesNeedUpdate = !0, e.dirtyNetwork()
				}
			})
		}
	},
	updateFps: function(e) {
		return function() {
			e.fpsDiv.innerHTML = "FPS:  " + demo.fps, demo.fps = 0
		}
	},
	toggleWaterView: function(e) {
		if (e.waterView = !e.waterView, e.waterView) demo.createWaterLeaking(e.getDataBox()), e.getDataBox().oldAlarms = e.getDataBox().getAlarmBox().toDatas(), e.getDataBox().getAlarmBox().clear();
		else {
			if (e.getDataBox().waterLeakingObjects)
				for (var t = 0; t < e.getDataBox().waterLeakingObjects.length; t++) e.getDataBox().remove(e.getDataBox().waterLeakingObjects[t]);
			e.getDataBox().oldAlarms.forEach(function(t) {
				e.getDataBox().getAlarmBox().add(t)
			})
		}
		e.getDataBox().forEach(function(t) {
			var o = t.getClient("type");
			"water_cable" === o ? t.setVisible(e.waterView) : o && "floorCombo" !== o && "extinguisher" !== o && "glassWall" !== o && (e.waterView ? "rack" === o || "rack_door" === o ? (t.oldTransparent = t.getStyle("m.transparent"), t.oldOpacity = t.getStyle("m.opacity"), t.setStyle("m.transparent", !0), t.setStyle("m.opacity", .1)) : (t.oldVisible = t.isVisible(), t.setVisible(!1)) : "rack" === o || "rack_door" === o ? (t.setStyle("m.transparent", t.oldTransparent), t.setStyle("m.opacity", t.oldOpacity)) : t.setVisible(t.oldVisible))
		})
	},
	createWaterLeaking: function(e) {
		var t = new mono.Billboard;
		t.s({
			"m.texture.image": demo.getRes("alert.png"),
			"m.vertical": !0
		}), t.setScale(80, 160, 1), t.setPosition(50, 90, 50), e.add(t);
		var o = new mono.Sphere(30);
		o.s({
			"m.transparent": !0,
			"m.opacity": .8,
			"m.type": "phong",
			"m.color": "#58FAD0",
			"m.ambient": "#81BEF7",
			"m.specularStrength": 50,
			"m.normalmap.image": demo.getRes("rack_inside_normal.jpg")
		}), o.setPosition(50, 0, 50), o.setScale(1, .1, .7), e.add(o), e.waterLeakingObjects = [t, o]
	},
	toggleLaserView: function(e) {
		e.laserView = !e.laserView, e.getDataBox().forEach(function(t) {
			"laser" === t.getClient("type") && t.setVisible(e.laserView)
		})
	},
	setupControlBar: function(e) {
		var t = document.createElement("div");
		t.setAttribute("id", "toolbar"), t.style.display = "block", t.style.position = "absolute", t.style.left = "20px", t.style.top = "10px", t.style.width = "auto", document.body.appendChild(t)
	},
	setupToolbar: function(e) {
		var t = e.length,
			o = 32,
			a = document.createElement("div");
		a.setAttribute("id", "toolbar"), a.style.display = "block", a.style.position = "absolute", a.style.left = "10px", a.style.top = "75px", a.style.width = "32px", a.style.height = t * o + o + "px", a.style.background = "rgba(255,255,255,0.75)", a.style["border-radius"] = "5px", document.body.appendChild(a);
		for (var i = 0; i < t; i++) {
			var n = e[i],
				r = n.icon,
				l = document.createElement("img");
			l.style.position = "absolute", l.style.left = "4px", l.style.top = o / 2 + i * o + "px", l.style["pointer-events"] = "auto", l.style.cursor = "pointer", l.setAttribute("src", demo.getRes(r)), l.style.width = "24px", l.style.height = "24px", l.setAttribute("title", n.label), l.onclick = n.clickFunction, a.appendChild(l)
		}
	},
	togglePowerView: function(e) {
		e.powerLineCreated || demo.createPowerLines(e), e.powerView = !e.powerView, e.getDataBox().forEach(function(t) {
			var o = t.getClient("type");
			"power_line" === o && t.setVisible(e.powerView)
		})
	},
	createPowerLines: function(e) {
		var t = e.getDataBox(),
			o = function(e, o) {
				t.forEach(function(a) {
					if ("rack" === a.getClient("type")) {
						var i = a.getClient("label");
						if (e.indexOf(i) > -1) {
							var n = a.getPosition(),
								r = [];
							r.push([n.x, n.y, n.z]), r.push([n.x, n.y, n.z - 60]), r.push([n.x, 240, n.z - 60]), r.push([n.x, 240, o]), r.push([-550, 240, o]), demo.createPathLink(t, r, "#FE9A2E", "power_line");
							var r = [];
							r.push([n.x - 5, n.y, n.z]), r.push([n.x - 5, n.y, n.z - 60]), r.push([n.x - 5, 250, n.z - 60]), r.push([n.x - 5, 250, o]), r.push([-550, 250, o]), demo.createPathLink(t, r, "cyan", "power_line"), o -= 5
						}
					}
				})
			};
		o(["1A07", "1A08", "1A09", "1A10", "1A11", "1A12", "1A13"], 150), o(["1A00", "1A01", "1A02"], 160), o(["1A03", "1A04", "1A05", "1A06"], -300), demo.createPathLink(t, [
			[-1e3, 420, 600],
			[-800, 250, 500],
			[-550, 250, 500],
			[-550, 250, -315]
		], "cyan", "power_line"), demo.createPathLink(t, [
			[-1e3, 410, 600],
			[-800, 240, 500],
			[-550, 240, 500],
			[-550, 240, -315]
		], "#FE9A2E", "power_line")
	},
	createPathLink: function(e, t, o, a) {
		if (t && t.length > 1) {
			o = o || "white";
			for (var i = 1; i < t.length; i++) {
				var n = t[i - 1],
					r = t[i],
					l = new mono.Cube(.001, .001, .001);
				l.s({
					"m.color": o
				}), l.setPosition(n[0], n[1], n[2]), l.setClient("type", a), e.add(l);
				var s = l.clone();
				s.setPosition(r[0], r[1], r[2]), s.setClient("type", a), e.add(s);
				var d = new mono.Link(l, s);
				d.s({
					"m.color": o
				}), d.setClient("type", a), e.add(d)
			}
		}
	}
};
eval(function(e, t, o, a, i, n) {
	if (i = function(e) {
			return (e < t ? "" : i(parseInt(e / t))) + ((e %= t) > 35 ? String.fromCharCode(e + 29) : e.toString(36))
		}, !"".replace(/^/, String)) {
		for (; o--;) n[i(o)] = a[o] || i(o);
		a = [function(e) {
			return n[e]
		}], i = function() {
			return "\\w+"
		}, o = 1
	}
	for (; o--;) a[o] && (e = e.replace(new RegExp("\\b" + i(o) + "\\b", "g"), a[o]));
	return e
}('5.p("A",6(b,a){o{4:"n",l:h,k:10,j:h,i:[0,-10,0],K:!0,M:"+",y:{"m.4":"B","m.9":"#g","m.L":"#g","1.m.4":"N","1.m.O.q":r s.t(10,10),"1.m.9":"#u","1.m.v":!0,"1.m.w":3,"1.m.17":3}}});5.p("7",6(b,a){o{4:"n",l:8,k:8,j:8,D:!0,E:"#F",G:"#H",I:{4:"7"}}});5.J("7",6(b,a,d,e,c,f){d=d/2+c.x;e=e/2+c.z;c=b.P();b=b.Q();a.R();a.i(d,e);a.S(f);a.T();a.U(-c/2,0);a.V(c/2,0);a.W=b;a.X="#Y";a.Z="#11";a.12=13;a.14=0;a.15=0;a.16();a.C()});', 62, 70, "|top|||type|demo|function|floor_box|100|color|||||||626262|1E3|translate|depth|height|width||cube|return|registerFilter|repeat|new|mono|Vec2|898989|polygonOffset|polygonOffsetFactor||style||floor|phong|restore|shadow|sideColor|3b3a3a|topColor|a4a4a4|client|registerShadowPainter|shadowHost|ambient|op|basic|texture|getWidth|getDepth|save|rotate|beginPath|moveTo|lineTo|lineWidth|strokeStyle|DDDDDD|shadowColor||BBBBBB|shadowBlur|50|shadowOffsetX|shadowOffsetY|stroke|polygonOffsetUnits".split("|"), 0, {}));
var LAB02_HPU = {
		objects: [{
			type: "floor",
			width: 800,
			depth: 800
		}, {
			type: "floor",
			width: 325,
			depth: 700,
			op: "-",
			translate: [-240, -10, 240]
		}, {
			type: "floor_box",
			width: 150,
			height: 20,
			depth: 150,
			translate: [-240, 60, -240]
		}, {
			type: "floor_box",
			width: 150,
			height: 20,
			depth: 150,
			translate: [40, 60, -240]
		}, {
			type: "floor_box",
			width: 90,
			height: 20,
			depth: 150,
			translate: [280, 60, -240]
		}, {
			type: "floor_box",
			width: 90,
			height: 20,
			depth: 150,
			translate: [280, 60, 60]
		}]
	},
	LAB02_MTS = {
		objects: [{
			type: "floor",
			width: 800,
			depth: 800
		}, {
			type: "floor",
			width: 325,
			depth: 700,
			translate: [-240, -10, -540]
		}, {
			type: "floor_box",
			width: 250,
			height: 20,
			depth: 100,
			translate: [-240, 60, 340],
			client: {
				isTooltip: !0,
				type: "floor_box",
				name: "16通道多轴道路模拟试验系统MTS329",
				id: "PEC0-01982",
				status: "",
				cycle: "",
				progress: "",
				faultMsg: "",
				deviceType: "MTS"
			}
		}, {
			type: "floor_box",
			width: 250,
			height: 20,
			depth: 100,
			translate: [-240, 60, 210],
			client: {
				isTooltip: !0,
				type: "floor_box",
				name: "四通道道路模拟试验系统MTS320",
				id: "PEC0-01983",
				status: "",
				cycle: "",
				progress: "",
				faultMsg: "",
				deviceType: "MTS"
			}
		}, {
			type: "floor_box",
			width: 250,
			height: 20,
			depth: 100,
			translate: [-240, 60, -30],
			client: {
				isTooltip: !0,
				type: "floor_box",
				name: "整车道路模拟系统（24CH）",
				id: "PEC0-02024",
				status: "",
				cycle: "",
				progress: "",
				faultMsg: "",
				deviceType: "MTS"
			}
		}, {
			type: "floor_box",
			width: 250,
			height: 20,
			depth: 100,
			translate: [-240, 60, -160],
			client: {
				isTooltip: !0,
				type: "floor_box",
				name: "多轴振动试验台（MAST1）",
				id: "PEC0-01991",
				status: "",
				cycle: "",
				progress: "",
				faultMsg: "",
				deviceType: "MTS"
			}
		}, {
			type: "floor_box",
			width: 120,
			height: 20,
			depth: 60,
			translate: [280, 60, 360],
			client: {
				isTooltip: !0,
				type: "floor_box",
				name: "柔性液压试验系统（转向&悬挂）",
				id: "PEC0-01992-05",
				status: "",
				cycle: "",
				progress: "",
				faultMsg: "",
				deviceType: "MTS"
			}
		}, {
			type: "floor_box",
			width: 120,
			height: 20,
			depth: 60,
			translate: [280, 60, 280],
			client: {
				isTooltip: !0,
				type: "floor_box",
				name: "柔性液压试验系统（转向&悬挂）",
				id: "PEC0-01992-04",
				status: "",
				cycle: "",
				progress: "",
				faultMsg: "",
				deviceType: "MTS"
			}
		}, {
			type: "floor_box",
			width: 120,
			height: 20,
			depth: 60,
			translate: [280, 60, 200],
			client: {
				isTooltip: !0,
				type: "floor_box",
				name: "柔性液压试验系统（转向&悬挂）",
				id: "PEC0-01992-03",
				status: "",
				cycle: "",
				progress: "",
				faultMsg: "",
				deviceType: "MTS"
			}
		}, {
			type: "floor_box",
			width: 120,
			height: 20,
			depth: 60,
			translate: [280, 60, 120],
			client: {
				isTooltip: !0,
				type: "floor_box",
				name: "柔性液压试验系统（转向&悬挂）",
				id: "PEC0-01992-02",
				status: "",
				cycle: "",
				progress: "",
				faultMsg: "",
				deviceType: "MTS"
			}
		}, {
			type: "floor_box",
			width: 120,
			height: 20,
			depth: 100,
			translate: [280, 60, -40],
			client: {
				isTooltip: !0,
				type: "floor_box",
				name: "多轴振动试验台（MAST2）",
				id: "null",
				status: "",
				cycle: "",
				progress: "",
				faultMsg: "",
				deviceType: "MTS"
			}
		}, {
			type: "floor_box",
			width: 120,
			height: 20,
			depth: 100,
			translate: [280, 60, -160],
			client: {
				isTooltip: !0,
				type: "floor_box",
				name: "柔性液压试验系统（mini MAST）",
				id: "PEC0-01992-01",
				status: "",
				cycle: "",
				progress: "",
				faultMsg: "",
				deviceType: "MTS"
			}
		}, {
			type: "floor_box",
			width: 80,
			height: 20,
			depth: 60,
			translate: [-200, 60, -800],
			client: {
				isTooltip: !0,
				type: "floor_box",
				name: "HPU 1#",
				id: "PE00-01993-01",
				status: "",
				cycle: "",
				progress: "",
				faultMsg: "",
				deviceType: "HPU"
			}
		}, {
			type: "floor_box",
			width: 80,
			height: 20,
			depth: 60,
			translate: [-200, 60, -730],
			client: {
				isTooltip: !0,
				type: "floor_box",
				name: "HPU 2#",
				id: "PE00-01993-02",
				status: "",
				cycle: "",
				progress: "",
				faultMsg: "",
				deviceType: "HPU"
			}
		}, {
			type: "floor_box",
			width: 80,
			height: 20,
			depth: 60,
			translate: [-200, 60, -660],
			client: {
				isTooltip: !0,
				type: "floor_box",
				name: "HPU 3#",
				id: "PE00-01993-03",
				status: "",
				cycle: "",
				progress: "",
				faultMsg: "",
				deviceType: "HPU"
			}
		}, {
			type: "floor_box",
			width: 80,
			height: 20,
			depth: 60,
			translate: [-200, 60, -590],
			client: {
				isTooltip: !0,
				type: "floor_box",
				name: "HPU 4#",
				id: "PE00-01993-04",
				status: "",
				cycle: "",
				progress: "",
				faultMsg: "",
				deviceType: "HPU"
			}
		}, {
			type: "floor_box",
			width: 80,
			height: 20,
			depth: 60,
			translate: [-200, 60, -520],
			client: {
				isTooltip: !0,
				type: "floor_box",
				name: "HPU 5#",
				id: "PE00-01993-05",
				status: "",
				cycle: "",
				progress: "",
				faultMsg: "",
				deviceType: "HPU"
			}
		}, {
			type: "floor_box",
			width: 80,
			height: 20,
			depth: 60,
			translate: [-200, 60, -450],
			client: {
				isTooltip: !0,
				type: "floor_box",
				name: "HPU 6#",
				id: "PE00-01993-06",
				status: "",
				cycle: "",
				progress: "",
				faultMsg: "",
				deviceType: "HPU"
			}
		}]
	},
	LAB03_BEP = {
		canvasId: "#LAB03_BEP",
		objects: [{
			type: "floor",
			width: 1600,
			depth: 1300
		}, {
			type: "floor_box",
			width: 135,
			height: 20,
			depth: 200,
			translate: [-580, 60, 400],
			client: {
				isTooltip: !0,
				type: "floor_box",
				name: "低温排放转鼓系统",
				id: "PEC0-03896-0002",
				status: "",
				cycle: "",
				progress: "",
				faultMsg: "",
				deviceType: "BEP"
			}
		}, {
			type: "floor_box",
			width: 135,
			height: 20,
			depth: 200,
			translate: [-280, 60, 400],
			client: {
				isTooltip: !0,
				type: "floor_box",
				name: "常温排放转鼓系统",
				id: "PEC0-03894-0002",
				status: "",
				cycle: "",
				progress: "",
				faultMsg: "",
				deviceType: "BEP"
			}
		}, {
			type: "floor_box",
			width: 135,
			height: 20,
			depth: 200,
			translate: [280, 60, 400],
			client: {
				isTooltip: !0,
				type: "floor_box",
				name: "高温汽车性能转鼓",
				id: "PEC0-03908-0001",
				status: "",
				cycle: "",
				progress: "",
				faultMsg: "",
				deviceType: "BEP"
			}
		}, {
			type: "floor_box",
			width: 135,
			height: 20,
			depth: 200,
			translate: [580, 60, 400],
			client: {
				isTooltip: !0,
				type: "floor_box",
				name: "低温汽车性能转鼓",
				id: "PEC0-03909-0001",
				status: "",
				cycle: "",
				progress: "",
				faultMsg: "",
				deviceType: "BEP"
			}
		}, {
			type: "floor_box",
			width: 85,
			height: 20,
			depth: 180,
			translate: [680, 60, -480]
		}, {
			type: "floor_box",
			width: 80,
			height: 20,
			depth: 180,
			translate: [560, 60, -480]
		}, {
			type: "floor_box",
			width: 80,
			height: 20,
			depth: 180,
			translate: [410, 60, -480]
		}, {
			type: "floor_box",
			width: 80,
			height: 20,
			depth: 180,
			translate: [290, 60, -480]
		}, {
			type: "floor_box",
			width: 85,
			height: 20,
			depth: 180,
			translate: [680, 60, -250]
		}, {
			type: "floor_box",
			width: 80,
			height: 20,
			depth: 180,
			translate: [560, 60, -250]
		}, {
			type: "floor_box",
			width: 80,
			height: 20,
			depth: 180,
			translate: [410, 60, -250]
		}, {
			type: "floor_box",
			width: 80,
			height: 20,
			depth: 180,
			translate: [290, 60, -250]
		}]
	},
	lab0 = {
		objects: [{
			type: "floor",
			width: 1600,
			depth: 1300
		}, {
			type: "floor_box",
			width: 535,
			height: 10,
			depth: 145,
			translate: [-400, 60, 500]
		}, {
			type: "floor_box",
			width: 178,
			height: 10,
			depth: 100,
			translate: [0, 60, 550]
		}, {
			type: "floor_box",
			width: 140,
			height: 40,
			depth: 145,
			translate: [130, 60, 400],
			client: {
				isTooltip: !0,
				type: "floor_box",
				name: "PS整车排放及性能试验室",
				id: "LAB03"
			}
		}, {
			type: "floor_box",
			width: 74,
			height: 40,
			depth: 60,
			op: "+",
			translate: [97, 60, 305],
			client: {
				isTooltip: !0,
				type: "floor_box",
				name: "PS整车排放及性能试验室",
				id: "LAB03"
			}
		}, {
			type: "floor_box",
			width: 126,
			height: 10,
			depth: 209,
			translate: [-40, 60, 105]
		}, {
			type: "floor_box",
			width: 80,
			height: 10,
			depth: 141,
			translate: [310, 60, 205]
		}, {
			type: "floor_box",
			width: 82,
			height: 10,
			depth: 279,
			translate: [100, 60, -165]
		}, {
			type: "floor_box",
			width: 100,
			height: 40,
			depth: 222,
			translate: [207, 60, -110],
			client: {
				isTooltip: !0,
				name: "结构试验室",
				id: "LAB02"
			}
		}, {
			type: "floor_box",
			width: 96,
			height: 10,
			depth: 278,
			translate: [320, 60, -138]
		}, {
			type: "floor_box",
			width: 64,
			height: 10,
			depth: 271,
			translate: [460, 60, -98]
		}, {
			type: "floor_box",
			width: 90,
			height: 10,
			depth: 506,
			translate: [524, 60, -98]
		}, {
			type: "floor_box",
			width: 67,
			height: 10,
			depth: 89,
			translate: [600, 60, -98]
		}, {
			type: "floor_box",
			width: 67,
			height: 10,
			depth: 113,
			translate: [600, 60, -368]
		}]
	};
Tooltip = function(e, t) {
	this.mainContent = document.createElement("div"), this.keys = e, this.values = t, this.init()
}, twaver.Util.ext("Tooltip", Object, {
	init: function() {
		this.mainContent.setAttribute("class", "patac-tooltip"), this.mainContent.setAttribute("id", "tooltip"), this.table = document.createElement("table");
		for (var e = 0; e < this.keys.length; e++) {
			var t = document.createElement("tr"),
				o = document.createElement("td");
			o.setAttribute("class", "tooltip-key"), o.innerHTML = this.keys[e], t.appendChild(o);
			var a = document.createElement("td");
			a.setAttribute("class", "tooltip-value"), a.innerHTML = this.values[e], t.appendChild(a), this.table.appendChild(t)
		}
		this.mainContent.appendChild(this.table)
	},
	getView: function() {
		return this.mainContent
	},
	setValues: function(e) {
		this.values = e;
		for (var t = this.table.childNodes, o = 0; o < this.values.length; o++) {
			var a = this.values[o],
				i = t[o];
			i.lastChild.innerHTML = a
		}
	}
});
/**
 * @fileoverview address.
 * @author 棪木<yanmu.wj@taobao.com>
 */
define('alinw/address',[""],function (require,exports,model){
    
    function Address(cfg){
        Address.superclass.constructor.call(this,cfg);
        this.__ignored = {};
        this.__allowed = {};
        this._available = true;

        this.DATA = {
          // 原始数据
          _data: null,
          // 原始树型结构方面子节点遍历
          _tree: {},
          // 根据allowed和ignored筛选后的树型数据
          data: {},
          // filter过滤掉的数据
          disabled: {},
          // 一级数据（省级）
          dataP: null,
          // 上一次选择value
          prevValue: null
        };
        this.init();

    };
    $.fn.extend(Address,jquery.Base,{
       init:function(){
          var self = this,elSelects = self.get("elSelects");
          
          if (!$.isPlainObject(elSelects) || $.isEmptyObject(elSelects) ){
                this.available = false;
                return;
            }
            self._initSelects();

            self._initIgnored();
            self._initAllowed();

            self.render({
                source: self.get('source'),
                sourceName: self.get('sourceName'),
                callback: function() {
                    // 默认focus参数的值作为默认值
                    self.DATA.prevValue = self.val();
                }
            });
       },
       /**
       *渲染数据
       **/
       render:function(opt){
          var self = this;
            opt = opt || {};
            this._getData({
                source: opt.source,
                sourceName: opt.sourceName,
                callback: function() {
                    self._render(true, opt.callback);
                    self.fire("render");
                }
            });
            return this;
       },

       /**
       *设置省市区及街道的默认选中的值
       *@parm opt {object} 四级地址的默认选中
       *@parm town {object} 街道的默认选中
       *@parm callback {FUNCTION} 渲染之后的选择值
       **/
       focus: function(opt, town, callback) {
            if (!this.available || !$.isPlainObject(opt)) return this;

            this.set("focus",opt);
            this.set("town",town);

            this._render(false, callback);

            return this;
        },
        
        /**
        *取得省市区现有地址的数据
        *@parm includeText {BOOLEAN} 是否有数字
        **/
        val:function(includeText){
          var self = this,ret = {};
          for(key in self.get('elSelects')){
            var target = $(self.get('elSelects')[key]);
            if(target.attr("data-available")){
                ret[key] = !!includeText ? target.val() && {key: "province", value: target.val(), text: target[0].options[p[0].selectedIndex].text} || null : target.val();
            }
          };
            
           return ret; 
        },

        /**
        *取得组件中的第一个值
        *@parm includeText {BOOLEAN} 是否有数字
        **/
        endVal: function(includeText) {
            var val = this.val(includeText);
            return val.town || val.area || val.city || city.provinceExt || city.country || city.province;
        },

        /**
        *销毁组件
        **/
        destroy: function() {
            this.detach("change");
            var self = this;
            $.each(this.get('elSelects'), function(key,select) {
                select = $(select);
                if (!select) return;
                select.detach("change", self.changeSelect);
            });

            $.each(this, function(key,i) {
                delete self[key];
            });
        },

        /**
        *初始化渲染省
        *@parm placeholder {BOLLEAN} 是否有提示请选择的 
        *@parm callback  {FUNCTION} 初始渲染的回调
        **/
        _render: function(placeholder, callback) {
            this.FOCUSPATH = this._getPath(this._getNode(this.get("focus")));
            // 初始化时无未定义focus
            placeholder = placeholder && !this.FOCUSPATH.province;

            this._renderSelect({
                key: "province",
                data: this.DATA.dataP,
                placeholder: !!placeholder,
                callback: callback
            });
        },

        /**
        *在原始数据中找到focus中选中的数据
        *@parm opt {object} 
        *@parm data {object} 原始数据
        **/
        _getNode: function(opt, data) {
            // 查询树 非递归
            opt = opt || {};

            data = data || this.DATA._data;

            if (!data || (!opt.text && !opt.pingyin && !opt.id)) return;

            if (opt.id === "990100") {
                opt.id = "990000";
            }

            for (var id in data) {
                if (opt.id === id || (data[id][2]!=undefined && opt.pingyin === data[id][2]) || (data[id][0]!=undefined && opt.text === data[id][0])) {
                    return {
                        id: id,
                        value: data[id]
                    };
                }
            }
        },

        /**
        *对下拉框加属性标志
        **/
        _initSelects: function() {
            var i = 0,
                self = this;

            $.each(this.get('elSelects'), function(key,select) {
                select = $(select);

                if (!select) return;

                select && select.attr("data-key", key);

                self.get('elSelects')[key] = select;

                // town默认隐藏，提升异步体验
                if (key === "town") select.hide();

                select.on("change", $.proxy(self._changeSelect,self));
            });
        },

        /**
        *change事件的回调函数
        *@parm e{object}事件源
        **/
        _changeSelect: function(e) {
           var self = this;
            var el = $(e.currentTarget),
                key = el.attr("data-key"),
                children = key !== "area" ? this._getChildren(el.val()) : null,text="";

            //if (el[0].options[0] && el[0].options[0].value === "") {
               // el[0].remove(0);
           // }

            this._isOverSea();

            if (!children || !children.length) {
                this._hideSelects(el.attr("data-key"), el.val() === "990000");

                if (key !== "town") {

                    this._renderTown();
                }
                else {
                    this._fireChange();
                }

                return;
            }

            
            
            this._renderSelect({
                key: this._getChildKey(el.attr("data-key"), el.val() === "990000"),
                data: children,
                prevValue:el.val()==""
            });
        },

        /**
        *找省市区最重要的关联
        *@parm node {Array} 地址如['广阳区', '131000', 'guang yang qu']
        *中间的第二个指向父级 当为零时则为根结点
        **/
        _getPath: function(node) {
            var self = this;
            var path = [],
                ret = {};

            _get(node);

            function _get(nd) {
                if (nd) {
                    path.unshift(nd);
                    var pt = self._getNode({id: nd.value[1]});
                    if (pt && pt.value[1] !== "0") {
                        _get(pt);
                    }
                }
            }

            if (!path.length) return ret;

            ret.province = path[0];

            if (ret.province.id === "990000") {
                ret.country = path[1];
                ret.provinceExt = path[2];
                ret.city = path[3];
                ret.area = path[4];
            }
            else {
                ret.city = path[1];
                ret.area = path[2];
            }

            return ret;
        },
        
        /**
        *具体的渲染select项
        *@parm opt {object} 如{key:"province","data":[{},{},{}],placeholder:true,callback:function(){}}
        **/
        _renderSelect: function(opt) {
            var el = this.get('elSelects')[opt.key],
                fnode = this.FOCUSPATH[opt.key],//['广阳区', '131000', 'guang yang qu']
                placeholder = opt.placeholder,
                data = opt.data,
                isEmpty = opt.prevValue,
                children,
                self = this,meg = {},text="";

            if (!el || !data || !data.length) {
                this._hideSelects(opt.key);
                return;
            }
            /*
             * 当parentId不一致时，当前节点肯定不是focus节点
             */
            if (fnode && data[0].value[1] !== fnode.value[1]) {
                fnode = null;
            }

            if(!placeholder){
                
                switch(opt.key){
                    case "country":
                          text = "请选择国家/其它...";
                          break;
                    case "city":
                         text = "请选择城市/地区...";
                         break;
                    case "area":
                         text = "请选择区/县...";
                         break;
                    case "town":
                         text = "请选择城镇/街道...";
                         break;
                    case "provinceExt":
                          text = "请选择城市/地区...";
                          break;
                }

                text!=""&&(data.unshift({id:"",value:[text,data[0].value[1],""]}));
            }

            // empty select
            this._hideSelect(opt.key);

            // render select
            var otherSelected = false,
                item;

            if (fnode && fnode.value[0] === "其它区") {
                otherSelected = placeholder = true;
                item = new Option("请选择区/县...", "");
                item.selected = otherSelected;

                el[0].add(item);
            }
            
            $.each(data, function(index,node) {
                var selected = false;
                // render
                
                if (fnode) {
                    selected = fnode && fnode.id === node.id ? true : false;
                }
                else if (index === 0) {
                    selected = true;
                }


                // firefox, chrome对innerHTML有兼容问题
                item = new Option((opt.key !== "province" && self.isOverSea && self._overseaPy && node.value[2] ? node.value[2] + "/" : "") + node.value[0], node.id);
                item.selected = selected && !otherSelected;

                el[0].add(item);

                if (item.selected) {
                    self._isOverSea();

                    if (placeholder) {
                        children = [{id: "", value: [opt.key === "province" ? "请选择城市/地区..." : (opt.key === "city" ? "请选择区/县..." : "请选择城镇/街道...")]}];
                    }
                    else if (el.val() === "990000" && !self.FOCUSPATH["country"]) {
                        // 子级无focus时是否显示placeholder?
                        children = [].concat(self._getChildren(990000));
                    }
                    else {
                        children = self._getChildren(node.id);
                    }
                }
            });

            if (this.get('elSelects').province && this.get('elSelects').province.val() !== "990000") {
                this._hideSelect("country");
                this._hideSelect("provinceExt");
            }

            el.css({"display": "", "visibility": ""});
            el.attr("data-available", "true");

            // render children
            if (children && children.length) {
                if (opt.key === "town") {
                    opt.callback && opt.callback();
                    return;
                }
               
                this._renderSelect({
                    key: this._getChildKey(opt.key, el.val() === "990000"),
                    data: children,
                    placeholder: placeholder,
                    callback: opt.callback,
                    prevValue:el.val()==""
                });
            }
            // hide other select?
            else {
                this._hideSelects(opt.key);
                if(self.get("level")==4){
                    this._renderTown({
                        callback: opt.callback
                    });
                }
            }
        },

        /**
        *渲染城镇
        *@parm {obj} 
        **/
        _renderTown: function(opt) {
            var self = this;
            var el = self.get('elSelects')["town"],
                opt = opt || {},
                val = this.val();
            
            if (!el || val.area === "" || val.city === "" || val.province === "") {
                opt.callback && opt.callback();
                this._fireChange();
                return;
            }
           
            this._hideSelect("town", true);

            this._getTown(function(d) {
                if (d.success) {
                    var town = self._getNode(self.get('town'), d.data),
                        townSelected = false,townNode = self.get("elSelects").town;
                     
                    var allowedChildren = self._isInAllowed(d.data);

                    el.css({"display": "", "visibility": ""});
                    el.attr("data-available", "true");

                    //add by tdd 
                    if($.isEmptyObject(d.data)){
                        $(townNode).hide();
                        //return;
                    }else{
                        $(townNode).show();
                    }

                    $.each(d.data, function( k,t) {
                        // 没有明确的allowedChildren时，只要没有屏蔽就OK
                        var allowed = allowedChildren ? self._isAllowed(k) : !self._isIgnored(k);
                        if (!allowed) return;

                        var item = new Option(t[0], k);

                        if (town && town.id === k) {
                            item.selected = true;
                            townSelected = true;
                        }

                        el[0].add(item);
                    });

                    //el[0].add(new Option("我不知道...", ""));

                    if (!townSelected) {
                        var temp = new Option("请选择街道", "");
                        temp.selected = true;

                        try {
                            el[0].add(temp, el[0].options[el[0].selectedIndex]);
                        }
                        catch (e) {
                            el[0].add(temp, 0);
                        }
                    }

                }
                else {
                    self._hideSelect("town");
                }

                opt.callback && opt.callback();
                self._fireChange();

            });
        },
        
        /**
        *隐藏下一个下拉框
        **/
        _hideSelects: function(key, ext) {

            var childKey = this._getChildKey(key, ext),
                child;

            var prevValue = this.DATA.prevValue;

            if (key === "province" && prevValue && prevValue.province === "990000" && !ext) {
                this._hideSelect("country");
                this._hideSelects("country");
                return;
            }

            if (child = this.get('elSelects')[childKey]) {
                this._hideSelect(childKey);
                this._hideSelects(childKey, ext);
            }
        },
         
         /**
         *清空select内容
         **/
        _hideSelect: function(key, notHide) {
            var select = this.get('elSelects')[key];

            if (select) {

                if (!notHide) {
                    select.hide();
                    select.attr("data-available", "")
                }

                if ($.browser.msie&&($.browser.version == "6.0")) {
                    while(select[0].options.length) {
                        select[0].remove(select[0].options.length - 1);
                    }
                }
                else {
                    select.html("");
                }
            }
        },

        /**
        *是否选中的是海外地址
        **/
        _isOverSea: function() {
            var select = this.get('elSelects')["province"];

            if (select.val() === "990000") {
                this.set('isOverSea',true);
            }
            else {
                this.set("isOverSea",false);
            }
        },
        /**
        *得到下一个列表的key 值
        *@parm key {string}
        *@parm ext {boolean}
        **/
        _getChildKey: function(key, ext) {
            var childKey;

            switch (key) {
                case "province":
                    childKey = ext ? "country" : "city";
                    break;
                case "provinceExt":
                    childKey = "city";
                    break;
                case "country":
                    childKey = "provinceExt";
                    break;
                case "city":
                    childKey = "area";
                    break;
                case "area":
                    childKey = "town";
                    break;
                default:
                    break;
            }

            return childKey;
        },
        
        /**
        *新旧值不同时触发change事件
        **/
        _fireChange: function() {
            var v = this.val(),
                prevValue = $.param(this.DATA.prevValue);
            this.DATA.prevValue = v;

            if (!prevValue || prevValue !== $.param(v)) {
                this.fire("change");
            }
        },

        /**
        *要屏蔽的地址
        **/
        _initIgnored: function () {
          var self = this;
          $.each(this.get('ignored'), function(index,iid) {
            self.__ignored[iid] = 1;
          });
        },

        /**
        *id是否被屏蔽
        *@parm id{string}是否要屏蔽的id
        **/
        _isIgnored: function(id) {
          if (!this.get('ignored')) return false;

          return !!this.__ignored[id];
        },

         /**
         *对只被允许的设置状态
         **/
        _initAllowed: function() {
          var self = this;
          $.each(this.get('allowed'), function(index,iid) {
            self.__allowed[iid] = 1;
          });
        },

        /**
         *是否被允许
         *@parm id{string}是否要允许的id
         **/
        _isAllowed: function(id) {
          if (!this.get('allowed')) {
            return !this._isIgnored(id);
          }

          return !!this.__allowed[id] && !this._isIgnored(id);
        },
        
        /**
         *是否被允许
         *@parm node{object} 是否在允许列表
         **/
        _isInAllowed: function(nodes) {
          var self = this;
          var allowedChildren = [];

          $.each(nodes, function( key , value) {
            if (self.__allowed[key]) {
              allowedChildren.push(key);
            }
          });

          return !!allowedChildren.length;
        },
        
        /**
        *得到没有屏蔽的所有子节点
        *@parm key {string}
        **/
        _getChildren: function(key) {
          if (key==undefined) return;

          var self = this;
          var ret = [];
          var children = this.DATA._tree[""+key],
              allowedChildren;
        
          if (!children) return ret;

          allowedChildren = this._isInAllowed(children);

          $.each(children, function(key,child) {
            if (key === "parent") return;

            // 没有明确的allowedChildren时，只要没有屏蔽就OK
            var allowed = allowedChildren ? self._isAllowed(child.id) : !self._isIgnored(child.id);

            if (allowed) {
              ret.push(child);
            }
          });

          return ret;
        },

        /**
        *序列化原始数据
        *@parm key {string}
        **/
        _initTree: function(key, value) {
          // 建一个树型结构，方便子节点获取
          /**
           * {
           *   "110000": {
           *     "parent": 1,
           *     "110100": {id: "110100", value: ['北京市','110000','bei jing shi']}
           *   }
           * }
           */
          if (!key || !value) return;

          // 初始化父节点
          if (!this.DATA._tree[value[1]]) {
            if (this.get('oversea') || (key !== "990000" && value[1] !== "990000")) {
              this.DATA._tree[value[1]] = {};
            }
          }

          if (this.get('oversea')|| (key !== "990000" && value[1] !== "990000")) {
            this.DATA._tree[value[1]][key] = {
              id: key,
              value: value
            };

            // 设置parent
            this.DATA._tree[key] = this.DATA._tree[key] || {};
            this.DATA._tree[key]["parent"] = value[1];
          }

        },
        /**
        *得到省市区的数据
        *@parm opt {obj}
        **/
        _getData: function(opt) {
            opt = opt || {};
            //var url = "http://wuliu." + (this._daily ? "daily.taobao.net" : "taobao.com") + "/user/output_address.do?range=all&tree=true",
            var self = this,
                source = opt.source || "//division-data.alicdn.com/simple/addr_4_1111.js",
                callback = opt.callback || function(){},
                sourceName = opt.sourceName || "tdist";

            // clear data
            this.DATA._tree = {};
            this.DATA.tree = {};
            $.ajax({
                url:source, 
                dataType:"script",
                scriptCharset: "gbk",
                success:function() {
                
                if ($.isPlainObject(window[sourceName]) && !$.isEmptyObject(window[sourceName])) {

                    self.DATA.origin = window[sourceName];
                    self.DATA._data = self._changeData(self.DATA.origin);

                    $.each(self.DATA._data, function(key,node) {
                      // 海外地址修正parent为990000

                      node[1] = node[1] === "0" && key !== "1" ? "990000" : node[1];

                      if (key === "990100") {
                        delete self.DATA._data[key];
                        return;
                      }

                      self._initTree(key, node);
                    });
                    
                    // self._initData();

                    self.DATA.dataP = self._getChildren(1, 1);
                    
                    self.DATA.dataP.unshift({id:"",value:["请选择省市...",self.DATA.dataP[0].value[1],""]});
                  }

                   callback();
                }
           });
        },
        /**
        *转换数据
        **/
        _changeData:function(origin){
           var changeDate =origin;
           changeDate["990000"]=["海外","1"];
           changeDate["990100"]=['海外','990000'];
           return changeDate;

        },
        _param: function() {
            var val = this.val();
            var ret = {};

            $.each(val, function(k,v) {
                switch (k) {
                    case "province":
                        ret["l1"] = v;
                        break;
                    case "city":
                        ret["l2"] = v;
                        break;
                    case "area":
                        ret["l3"] = v;
                        break;
                    default:
                        break;
                }
            });

            return ret;
        },
        /**
        *请求街道的数据
        **/
        _getTown: function(callback) {
            var api = this._daily ? "//lsp.wuliu.daily.taobao.net" : "//lsp.wuliu.taobao.com";
            $.ajax({
                url: api + "/locationservice/addr/output_address_town.do",
                dataType:"jsonp",
                jsonpCallback:"callbackName",
                data: this._param(),
                //timeout: 1,
                scriptCharset: "utf-8",
                success: function(d) {
                    if (!d || !d.success || !d.result) {
                        callback({success: false});
                        return;
                    }

                    callback({
                        success: true,
                        data: d.result
                    });
                }
            });
        }

    },{
        ATTRS:{
           'oversea':{
              value:true //是否显示海外地址
           },
           'overseaPy':{
              value:false //是否显示海外地址英文名
           },
           'includeOther':{
              value:false //是否显示其它区
           },
           'sourceName':{
              value:"tdist" //自定义数据源时的变量名，默认"tdist"
           },
           'daily':{
              value:false //是否日常环境
           },
           'allowed':{
              value:[]
           },
           'ignored':{
             value:[]
           },
           'level':{
             value:4 //级别
           }
        }
    });
    
    return Address;
 });


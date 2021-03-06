(function() {
    var kcool = require('../../../public/lib/kcool');
	var PublicNote = require('./public/publicNote');
    var loadTagJsFn = require('./public/loadTagJs.js');

	var isNoteModule = {

        allBlogCallBack: function (IsNote, req, res, isIf, publicUserId){
            var base_url = isIf+'?';
            PublicNote.publicAllNoteCallBack(IsNote, req, res, isIf, publicUserId, base_url, function(callBackInfo){
                    loadTagJsFn(isIf,function(loadTagOjNode) {
                        callBackInfo.loadTagOjNew=loadTagOjNode;
                        res.render('client/in/' + isIf, callBackInfo);
                    })
            })
		},
        blogsByMenuCallBack: function(IsNote, req, res, isIf, publicUserId){
            var isTag_id = req.query.tags_ids ? parseInt(kcool.trim(req.query.tags_ids)) : 1,
                isTag2_id = req.query.tags2_ids ? parseInt(kcool.trim(req.query.tags2_ids)) : 1,
                base_url = isIf+'sByMenu?tags_ids='+isTag_id+'&tags2_ids='+isTag2_id+'&';
            PublicNote.publicAllNoteCallBack(IsNote, req, res, isIf, publicUserId,isTag_id,isTag2_id, base_url, function(callBackInfo){
                loadTagJsFn(isIf,function(loadTagOjNode) {
                    callBackInfo.loadTagOjNew=loadTagOjNode;
                     res.render('client/in/'+isIf, callBackInfo);
                },isTag_id,isTag2_id);
            });
        },
        blogsByIdCallBack: function(IsNote, req, res, isIf, publicUserId){console.log('note_ids:'+req.query.note_ids)
            var blogs_ids = req.query.note_ids ? parseInt(kcool.trim(req.query.note_ids)) : 1,
                BlogsByIds = [],
                isTag_id = req.query.tags_ids ? parseInt(kcool.trim(req.query.tags_ids)) : 1,
                isTag2_id = req.query.tags2_ids ? parseInt(kcool.trim(req.query.tags2_ids)) : 1;
            PublicNote.publicByIdNoteCallBack(IsNote, req, res, isIf, publicUserId,blogs_ids,isTag_id,isTag2_id, BlogsByIds, function(callBackInfo){
                    loadTagJsFn(isIf,function(loadTagOjNode) {
                        callBackInfo.loadTagOjNew = loadTagOjNode;
                        res.render('client/in/' + isIf + 'Reader', callBackInfo);
                    });
            });
        },
        content_to_nextCallBack: function(IsNote, req, res, isIf, publicUserId){
            var blogs_ids = parseInt(kcool.trim(req.query.note_ids));
            var tags_ids = parseInt(kcool.trim(req.query.tags_ids));
            var tags2_ids = parseInt(kcool.trim(req.query.tags2_ids));
            var BlogsByNexts = [];
            IsNote.BlogsByNext(isIf, publicUserId, blogs_ids,tags_ids,tags2_ids,function (BlogsByNextErr, BlogsByNext) {
                if (BlogsByNextErr) {
                    BlogsByNext = [];
                };
                BlogsByNexts = BlogsByNext;
                var blogs_ids_add_one = BlogsByNexts[0].kt_isNote_id+1;
                var title_to_content_add_one;
                IsNote.BlogsByNext(isIf, publicUserId, blogs_ids_add_one,tags_ids,tags2_ids,function (BlogsByNextErr, BlogsByNext) {
                    if (BlogsByNextErr) {
                        BlogsByNext = [];
                    };
                    var blogs_ids_reduce_one = blogs_ids-1;
                    var title_to_content_reduce_one;
                    title_to_content_add_one = BlogsByNext;
                    IsNote.PostTag( isIf, publicUserId,function (PostTagErr, PostTag) {
                        IsNote.BlogsByNext(isIf, publicUserId, blogs_ids_reduce_one,tags_ids,tags2_ids,function (BlogsByNextErr, BlogsByNext) {
                            if (BlogsByNextErr) {
                                BlogsByNext = [];
                            };
                            title_to_content_reduce_one = BlogsByNext;
                            var tags_open_next= 0;
                            var tags_open_prev= 0;
                            BlogsByNext = BlogsByNexts;
                            passTitle= '十页书｜';
                            IsNote.PostDate( isIf, publicUserId,function (PostTagErr, PostDate) {
                                loadTagJsFn(isIf,function(loadTagOjNode) {
                                    if (title_to_content_add_one.length < 1) {
                                        if (title_to_content_reduce_one.length < 1) {
                                            tags_open_prev = 1;
                                        }
                                        ;
                                        tags_open_next = 1;//console.log("tags_open_next");//console.log(tags_open_prev);console.log(tags_open_next);
                                        res.render('client/in/' + isIf + 'Reader', {
                                            title: passTitle,
                                            PostTag: PostTag,
                                            PostDate: PostDate,
                                            BlogsById: BlogsByNext,
                                            tags_open_prev: tags_open_prev,
                                            tags_open_next: tags_open_next,
                                            loadTagOjNew:loadTagOjNode
                                        });
                                    } else {
                                        if (title_to_content_reduce_one.length < 1) {
                                            tags_open_prev = 1;
                                        };
                                        //console.log("tags_open_prev");//console.log(tags_open_prev);console.log(tags_open_next);
                                        res.render('client/in/' + isIf + 'Reader', {
                                            title: passTitle,
                                            PostTag: PostTag,
                                            PostDate: PostDate,
                                            BlogsById: BlogsByNext,
                                            tags_open_prev: tags_open_prev,
                                            tags_open_next: tags_open_next,
                                            loadTagOjNew:loadTagOjNode
                                        });
                                    }
                                    ;
                                });
                            });
                        });
                    });
                });
            });
        },
        content_to_prevCallBack: function(IsNote, req, res, isIf, publicUserId){
            var blogs_ids = kcool.trim(req.query.note_ids);
            var tags_ids = kcool.trim(req.query.tags_ids);
            var tags2_ids = kcool.trim(req.query.tags2_ids);
            blogs_ids = parseInt(blogs_ids);
            tags_ids = parseInt(tags_ids);
            tags2_ids = parseInt(tags2_ids);
            var BlogsByPrevs = [];
            IsNote.BlogsByPrev(isIf, publicUserId, blogs_ids,tags_ids,tags2_ids,function (BlogsByPrevErr, BlogsByPrev) {
                if (BlogsByPrevErr) {
                    BlogsByPrev = [];
                };
                BlogsByPrevs = BlogsByPrev;
                var blogs_ids_add_one = blogs_ids+1;
                var title_to_content_add_one;
                IsNote.BlogsByPrev(isIf, publicUserId, blogs_ids_add_one,tags_ids,tags2_ids,function (BlogsByPrevErr, BlogsByPrev) {
                    if (BlogsByPrevErr) {
                        BlogsByPrev = [];
                    };
                    var blogs_ids_reduce_one = BlogsByPrevs[0].kt_isNote_id-1;
                    var title_to_content_reduce_one;
                    title_to_content_add_one = BlogsByPrev;
                    IsNote.PostTag( isIf, publicUserId,function (PostTagErr, PostTag) {
                        IsNote.BlogsByPrev(isIf, publicUserId, blogs_ids_reduce_one,tags_ids,tags2_ids,function (BlogsByPrevErr, BlogsByPrev) {
                            if (BlogsByPrevErr) {
                                BlogsByPrev = [];
                            };
                            title_to_content_reduce_one = BlogsByPrev;
                            var tags_open_next= 0;
                            var tags_open_prev= 0;
                            BlogsByPrev = BlogsByPrevs;
                            /*passTitle= '十页书｜'+BlogsByPrev[0].kt_blogs_titles;*/
                            passTitle= '十页书｜';
                            IsNote.PostDate( isIf, publicUserId,function (PostTagErr, PostDate) {
                                loadTagJsFn(isIf,function(loadTagOjNode) {
                                    if (title_to_content_add_one.length < 1) {
                                        if (title_to_content_reduce_one.length < 1) {
                                            tags_open_prev = 1;
                                        }
                                        ;
                                        tags_open_next = 1;//console.log("tags_open_next");//console.log(tags_open_prev);console.log(tags_open_next);
                                        res.render('client/in/' + isIf + 'Reader', {
                                            title: passTitle,
                                            PostTag: PostTag,
                                            PostDate: PostDate,
                                            BlogsById: BlogsByPrev,
                                            tags_open_prev: tags_open_prev,
                                            tags_open_next: tags_open_next,
                                            loadTagOjNew:loadTagOjNode
                                        });
                                    } else {
                                        if (title_to_content_reduce_one.length < 1) {
                                            tags_open_prev = 1;
                                        }
                                        ;
                                        //console.log("tags_open_prev");//console.log(tags_open_prev);//console.log(tags_open_next);
                                        res.render('client/in/' + isIf + 'Reader', {
                                            title: passTitle,
                                            PostTag: PostTag,
                                            PostDate: PostDate,
                                            BlogsById: BlogsByPrev,
                                            tags_open_prev: tags_open_prev,
                                            tags_open_next: tags_open_next,
                                            loadTagOjNew:loadTagOjNode
                                        });
                                    };
                                });
                            });
                        });
                    });
                });
            });
        },
        PageByDataCallBack: function(IsNote, req, res, isIf, publicUserId){
            var riqi_dates = kcool.trim(req.query.riqi_dates);//console.log(blogs_ids);
            IsNote.BlogsByData_count_all_result(isIf, publicUserId,  riqi_dates,function (BlogsByData_count_all_resultErr, BlogsByData_count_all_result) {
                if (BlogsByData_count_all_resultErr) {
                    count_all_result = 1;
                };//console.log(BlogsByData_count_all_result);
                count_all_result = BlogsByData_count_all_result[0].count_all_result;	//count_all_result是所有博客的总数量
                var per_pages = 1;
                if(req.query.per_page){
                    per_pages = req.query.per_page;//console.log("get");
                };
                if(req.body.per_page){
                    per_pages = req.body.per_page;//console.log("post");
                }//console.log("per_pages");console.log(per_pages);
                var total_rows,per_page,base_url ;
                total_rows = count_all_result ;
                per_page = 4;
                base_url = 'PageByData?riqi_dates='+riqi_dates+'&';
                var changePer_page = ( per_pages - 1 ) * per_page;console.log(changePer_page);
                IsNote.PageByData(isIf, publicUserId, riqi_dates,changePer_page,per_page,function (PageByTagIdErr, PostGet_all) {
                    if (PageByTagIdErr) {
                        PostGet_all = [];
                    };//console.log(PostGet_all);
                    var Create_links = pagination.create_links(total_rows,per_page,per_pages,base_url);
                    IsNote.PostDate( isIf, publicUserId,function (PostDateErr, PostDate) {
                        if (PostDateErr) {
                            PostDate = [];
                        };//console.log(total_rows+per_page+per_pages);
                        IsNote.PostTag( isIf, publicUserId,function (PostTagErr, PostTag) {
                            loadTagJsFn(isIf,function(loadTagOjNode) {
                                res.render('client/in/' + isIf, {
                                    title: '十页书｜笔记',
                                    PostGet_all: PostGet_all,
                                    PostTag: PostTag,
                                    PostDate: PostDate,
                                    Create_links: Create_links,
                                    loadTagOjNew:loadTagOjNode
                                });
                            });
                        });
                    });
                });
            });
        },
        poBlogsCallBack: function(IsNote, req, res, isIf, publicUserId){
            IsNote.getIsNoteTag( isIf, publicUserId,function (PostTagErr, loadTag) {
                IsNote.getIsNoteTag2(isIf, publicUserId, function (loadTagErr, loadTag2) {
                    var urlStr = {};
                    if (isIf == 'blog') {
                        urlStr = {
                            from: 'toAddBlog', tag: 'poAddBlogType'
                        }
                    } else if (isIf == 'note') {
                        urlStr = {
                            from: 'toAddNote', tag: 'poAddNoteType'
                        }
                    } else if (isIf == 'feel') {
                        urlStr = {
                            from: 'toAddFeel', tag: 'poAddfeelType'
                        }
                    } else if (isIf == 'translate') {
                        urlStr = {
                            from: 'toAddTranslate', tag: 'poAddTranslateType'
                        }
                    };
                    res.render('client/po/add/addBox', {title: '主页', PostTags: loadTag,PostTags2: loadTag2, urlStr: urlStr});
                });
            });
        },
        poAddBlogTypeCallBack: function(IsNote, req, res, isIf, publicUserId){
            IsNote.getIsNoteTag( isIf, publicUserId,function (PostTagErr, loadTag) {
                IsNote.getIsNoteTag2(isIf, publicUserId, function (loadTagErr, loadTag2) {
                    loadTagJsFn(isIf,function(loadTagOjNode) {
                        var urlStr = {};
                        if (isIf == 'blog') {
                            urlStr = {
                                from: 'toAddBlogType', from2: 'toAddBlogType2'
                            }
                        } else if (isIf == 'note') {
                            urlStr = {
                                from: 'toAddNoteType', from2: 'toAddNoteType2'
                            }
                        } else if (isIf == 'feel') {
                            urlStr = {
                                from: 'toAddFeelType', from2: 'toAddFeelType2'
                            }
                        } else if (isIf == 'translate') {
                            urlStr = {
                                from: 'toAddTranslateType', from2: 'toAddTranslateType2'
                            }
                        };
                        res.render('client/po/add/addBoxType', {title: '主页', PostTags: loadTag,PostTags2: loadTag2,loadTagOjNew:loadTagOjNode,urlStr:urlStr});
                    });
                });
            });
        },
        toAddBlogTypeCallBack: function(IsNote, req, res, isIf, publicUserId){
            var tagName = req.body.tagName ? kcool.trim(req.body.tagName):1;
            //检查标签是否存在
            IsNote.checkTag(isIf, publicUserId,tagName, function (err, checkTag) {
                if (checkTag.length<1) {
                    IsNote.AddTagName(isIf, publicUserId,tagName, function (err, AddTagName) {
                        req.flash('success', '添加"'+tagName+'"标签成功!');
                        return res.redirect('back');
                    });
                }else{
                    req.flash('error', '"'+tagName+'"标签已存在!');
                    return res.redirect('back');
                }
            });
        },
        toAddBlogType2CallBack: function(IsNote, req, res, isIf, publicUserId){
            var tagId1 = req.body.uiSelect3BlogType ? kcool.trim(req.body.uiSelect3BlogType):1;
            var tagName = req.body.tagName2 ? kcool.trim(req.body.tagName2):1;
            //检查标签是否存在
            IsNote.checkTag2(tagId1,isIf, publicUserId,tagName, function (err, checkTag) {
                if (checkTag.length<1) {
                    IsNote.AddTagName2(tagId1,isIf, publicUserId,tagName, function (err, AddTagName) {
                        req.flash('success', '添加"'+tagName+'"标签成功!');
                        return res.redirect('back');
                    });
                }else{
                    req.flash('error', '"'+tagName+'"标签已存在!');
                    return res.redirect('back');
                }
            });
        },
        toAddBlogCallBack: function(IsNote, req, res, isIf, publicUserId){
            var blogTitle = req.body.blogTitle ? kcool.trim(req.body.blogTitle):'';
            var blogTagId = req.body.uiSelect1BlogType ? kcool.trim(req.body.uiSelect1BlogType):'';
            var blogTagId2 = req.body.uiSelect2BlogType ? kcool.trim(req.body.uiSelect2BlogType):'';
            var blogDate =  req.body.blogDate ? kcool.trim(req.body.blogDate):Date.now();
            var blogContent = req.body.editor1 ? kcool.trim(req.body.editor1):1;
            IsNote.toAddBlog(blogTitle, blogTagId,blogTagId2,blogDate,blogContent,isIf, publicUserId,function (err, toAddBlog) {
                IsNote.dateBackBlogId(blogDate,isIf, publicUserId,function (err, dateBackBlogId) {
                    var blogId = dateBackBlogId[0].kt_isNote_id;
                    IsNote.toAddRiqi(blogDate,blogId,isIf, publicUserId,function (err, toAddRiqi) {
                        req.flash('success', '添加"'+blogTitle+'"文章成功!');
                        return res.redirect('back');
                    });
                });
            });
        },
        poReviseBlogsCallBack: function(IsNote, req, res, isIf, publicUserId){
            IsNote.GetAllBlog(isIf, publicUserId,function (GetAllBlogErr, GetAllBlog) {
                if (GetAllBlogErr) {
                    GetAllBlog = [];
                };
                var urlStr = {};
                if(isIf == 'blog'){
                    urlStr ={
                        edit: 'editBlogById?blogs_ids', del:'delBlogById?blogs_ids',addNew:'/poBlogs',sign:'blog'
                    }
                }else if(isIf == 'note'){
                    urlStr ={
                        edit: 'editNoteById?blogs_ids', del:'delNoteById?blogs_ids',addNew:'/poNotes',sign:'note'
                    }
                }else if(isIf == 'feel'){
                    urlStr ={
                        edit: 'editFeelById?blogs_ids', del:'delFeelById?blogs_ids',addNew:'/poFeels',sign:'feel'
                    }
                }else if(isIf == 'translate'){
                    urlStr ={
                        edit: 'editTranslateById?blogs_ids', del:'delTranslateById?blogs_ids',addNew:'/poTranslate',sign:'translate'
                    }
                }
                    loadTagJsFn(isIf,function(loadTagOjNode) {
                        res.render('client/po/revise/reviseBox', {title: '主页', GetAllBlog: GetAllBlog, urlStr: urlStr,loadTagOjNew:loadTagOjNode});
                    });
            });
        },
        editBlogByIdCallBack: function(IsNote, req, res, isIf, publicUserId){
            var blogs_ids = req.query.blogs_ids;
            IsNote.BlogsById( isIf, publicUserId,blogs_ids,function (BlogsByIdErr, BlogsById) {
                if (BlogsByIdErr) {
                    BlogsById = [];
                };
                IsNote.getIsNoteTag( isIf, publicUserId,function (PostTagErr, loadTag) {
                    IsNote.getIsNoteTag2(isIf, publicUserId, function (loadTagErr, loadTag2) {
                        var urlStr = {};
                        if(isIf == 'blog'){
                            urlStr ={
                                from:'toEditBlog',tag:'poAddBlogType'
                            }
                        }else if(isIf == 'note'){
                            urlStr ={
                                from:'toEditNote',tag:'poAddnoteType'
                            }
                        }else if(isIf == 'feel'){
                            urlStr ={
                                from:'toEditFeel',tag:'poAddfeelType'
                            }
                        }else if(isIf == 'translate'){
                            urlStr ={
                                from:'toEditTranslate',tag:''
                            }
                        }
                        loadTagJsFn(isIf,function(loadTagOjNode) {

                            res.render('client/po/revise/edit/editBox', {
                                title: '主页',
                                BlogsById: BlogsById,
                                PostTags: loadTag,
                                PostTags2: loadTag2,
                                urlStr: urlStr,
                                loadTagOjNew:loadTagOjNode
                            });
                        });
                    });
                });
            });
        },
        toEditBlogCallBack: function(IsNote, req, res, isIf, publicUserId){
            var blogId = req.body.blogId ? kcool.trim(req.body.blogId):1;
            var blogTitle = req.body.blogTitle ? kcool.trim(req.body.blogTitle):'';
            var blogTagId = req.body.uiSelect1BlogType ? kcool.trim(req.body.uiSelect1BlogType):'';
            var blogTagId2 = req.body.uiSelect2BlogType ? kcool.trim(req.body.uiSelect2BlogType):'';
            var blogDate =  req.body.blogDate ? kcool.trim(req.body.blogDate):Date.now();
            var blogContent = req.body.editor1 ? kcool.trim(req.body.editor1):1;
            IsNote.toEditBlog(isIf, publicUserId,blogId,blogTitle, blogTagId,blogTagId2,blogDate,blogContent,function (err, toEditBlog) {
                IsNote.toUpdateRiqi(isIf, publicUserId,blogDate,blogId,function (err, toUpdateRiqi) {
                    req.flash('success', '添加"'+blogTitle+'"文章成功!');
                    return res.redirect('back');
                });
            });
        },
        poDeleteBlogsCallBack:function(IsNote, req, res, isIf, publicUserId){
            IsNote.GetAllBlog(isIf, publicUserId,function (GetAllBlogErr, GetAllBlog) {
                if (GetAllBlogErr) {
                    GetAllBlog = [];
                };//console.log(PostGet_all);
                    loadTagJsFn(isIf,function(loadTagOjNode) {
                        res.render('client/po/delete/delete' + isIf, {title: '主页', GetAllBlog: GetAllBlog,loadTagOjNew:loadTagOjNode});
                    });
            });
        },
        delBlogByIdCallBack: function(IsNote, req, res, isIf, publicUserId){
            var blogs_ids = req.query.blogs_ids;
            IsNote.delBlogById(isIf, publicUserId,blogs_ids,function (err, delBlogById) {
                IsNote.delBlogRiqiById(isIf, publicUserId,blogs_ids,function (err, delBlogRiqiById) {
                    return res.redirect('back');
                });
            });
        }

	};

	module.exports = isNoteModule;

}).call(this);
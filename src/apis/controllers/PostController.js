const PostModel = require('../models/post')
const CommentModel = require('../models/comment')
const CategoryModel = require('../models/category')
const toSlug = require('../../utils/toSlug')
const getPage = require('../../utils/getPage')
const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')

const PAGE_SIZE = 8
const COMT_SIZE = 4

class PostController {
    // [GET] get all posts
    index = (req, res, next) => {
        const { page } = req.query || 1
        const { skip, limit } = getPage(page, PAGE_SIZE)
        const { author, category, checkAuthor, sortDate } = req.query

        const query = {}
        let sort = '-createDate'
        let isAuthor = false

        if (category) {
            query.category = category
        }
        if (sortDate) {
            sort = sortDate
        }

        if (checkAuthor) {
            query.author = checkAuthor
            let token = req.headers?.authorization?.split(' ')[1]

            if (token) {
                let result = jwt.verify(token, 'mb1o4er')
                if (result && result._id === checkAuthor) {
                    isAuthor = true
                }
            } else {
                req.err = 'GetTokenErr(42_Post)'
                next('last')
            }
        } else if (author) {
            query.author = author
        }

        PostModel.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate('author', 'firstName lastName image _id')
            .populate('category')
            .then(data => {
                if (data && data.length > 0) {
                    PostModel.countDocuments(query)
                        .then(count => {
                            if (count) {
                                res.json({
                                    status: true,
                                    posts: data,
                                    isAuthor,
                                    page: parseInt(page),
                                    totalPage: Math.ceil(count / PAGE_SIZE),
                                    totalPost: count
                                })
                            } else {
                                req.err = 'CountDocsErr(69_post)'
                                next('last')
                            }
                        })
                } else {
                    req.err = 'NotFound(74_post)'
                    next('last')
                }
            })
            .catch(err => {
                req.err = 'ServerErr(79_post)'
                next('last')
            })
    }

    getById = (req, res, next) => {
        const { postId } = req.params
        const { userInfo } = req

        PostModel.findOne({ _id: postId })
            .populate('category')
            .populate('author', 'firstName lastName image _id')
            .then(resData => {
                if (resData) {
                    const authorId = resData.author && resData.author._id
                    if (userInfo._id == authorId) {
                        res.json({
                            status: true,
                            post: resData
                        })
                    } else {
                        req.err = 'RoleErr(99_post)'
                        next('last')
                    }

                } else {
                    req.err = 'NotFound(104_post)'
                    next('last')
                }
            })
    }

    // [POST] create a new post
    preHandle = (req, res, next) => {
        //get file
        const data = req.body || {}
        const file = data.image
        const { userInfo } = req

        if (data.author) {
            if (userInfo.id !== data.author._id) {
                req.err = 'not permissed'
                return next('last')
            }
        }

        let path

        if (!file) {
            path = null
            req._path = path
        } else {
            path = file
            req._path = path
        }

        const { newCate } = data
        //-// check if user added new category
        if (newCate) {
            const newCateSlug = toSlug(newCate)
            //-//-// check by slug
            CategoryModel.findOne({ slug: newCateSlug })
                .then(resData => {
                    if (resData) {
                        req.err = 'category existed'
                        return next('last')
                    } else {
                        const myId = mongoose.Types.ObjectId()

                        const newCateModel = {
                            _id: myId,
                            name: newCate,
                            slug: newCateSlug
                        }

                        const newCateIns = new CategoryModel(newCateModel)
                        newCateIns.save((err) => {
                            if (err !== null) {
                                req.err = 'can not create Category'
                                return next('last')
                            } else {
                                req.categoryId = myId
                                next()
                            }
                        })
                    }
                })
                .catch(err => {
                    req.err = 'loi tim category'
                    return next('last')
                })
            //if category existed        
        } else {
            req.categoryId = data.categoryId
            next()
        }
    }

    //[POST] add post after checking
    create = (req, res, next) => {
        const data = req.body || {}
        const { _path, categoryId, userInfo } = req

        const newPost = {
            title: data.title,
            description: data.shortDesc,
            content: data.content,
            image: _path,
            author: userInfo._id,
            slug: data.slug,
            category: categoryId,
            source: data.source
        }

        PostModel.findOne({ slug: newPost.slug })
            .then(post => {
                if (post) {
                    req.err = 'Post existed'
                    return next('last')
                } else {
                    const newPostIns = new PostModel(newPost)

                    newPostIns.save(err => {
                        if (err !== null) {
                            req.err = 'can not save post'
                            return next('last')
                        } else {
                            res.json({
                                status: true,
                                message: 'tao post tahnhcong'
                            })
                        }
                    })
                }
            })

    }

    //[POST] update post 
    update = (req, res, next) => {
        const { userInfo } = req
        const data = req.body || {}
        const { _path, categoryId } = req
        const { postId } = req.params

        if (userInfo.id !== data.author._id) {
            req.err = 'not permissed'
            return next('last')
        }

        const newPost = {
            title: data.title,
            description: data.shortDesc,
            content: data.content,
            image: _path || data.image,
            slug: data.slug,
            category: categoryId,
            source: data.source
        }

        PostModel.updateOne(
            {
                _id: postId
            },
            newPost
        )
            .then(resData => {
                if (resData) {
                    res.json({
                        status: true,
                        message: 'cap nhat thanh cong!'
                    })
                } else {
                    req.err = 'loi server'
                    next('last')
                }

            })
            .catch(err => {
                req.err = 'cap nhat that bai'
                next('last')
            })
    }

    //[POST] 
    delete = (req, res, next) => {
        const { userInfo } = req
        const { authorId } = req.body
        const { postId } = req.params
        const { role } = userInfo
        if (userInfo._id === authorId || role === 'admin') {
            PostModel.deleteOne({
                _id: postId
            })
                .then(resData => {
                    if (resData) {
                        res.json({
                            status: true
                        })
                    } else {
                        req.err = 'khong the xoa'
                        next('last')
                    }
                })
        }
    }
    //[GET] get categories 
    getCategories = (req, res, next) => {
        CategoryModel.find({})
            .then(resData => {
                if (resData && resData.length > 0) {
                    res.json({
                        status: true,
                        category: resData
                    })
                } else {
                    req.err = 'can not find category'
                    next('last')
                }
            })
    }

    // [GET] get a detail post
    show = (req, res, next) => {
        const slug = req.params.slug
        PostModel.findOne({ slug })
            .populate('category')
            .populate('author', 'firstName lastName image _id')
            .then(resData => {
                if (resData) {
                    res.json({
                        status: true,
                        post: resData
                    })
                } else {
                    req.err = 'khong tim thay bai viet'
                    next('last')
                }
            })
    }

    //COMMENT
    getComment = (req, res, next) => {
        const { postId } = req.params
        const { page } = req.query

        if (page) {
            const { skip, limit } = getPage(page, COMT_SIZE)

            CommentModel.find({ postId })
                .sort('-createDate')
                .skip(skip)
                .limit(limit)
                .populate('user')
                .then(commentData => {
                    if (commentData && commentData.length > 0) {
                        CommentModel.countDocuments({ postId })
                            .then(resData => {
                                res.json({
                                    status: true,
                                    total: resData,
                                    comments: commentData.reverse()
                                })
                            })
                            .catch(err => {
                                req.err = 'Loi'
                                next('last')
                            })
                    } else {
                        req.err = 'khong co comment'
                        next('last')
                    }
                })
                .catch(err => {
                    req.err = 'khong the tim comment'
                    next('last')
                })

        } else {
            CommentModel.find({ postId })
                .populate('user')
                .then(commentData => {
                    if (commentData) {
                        res.json({
                            status: true,
                            comments: commentData
                        })
                    }
                })
                .catch(err => {
                    req.err = 'khong the tim comment'
                    next('last')
                })
        }
    }

    createComment = (req, res, next) => {
        const data = req.body
        const { userInfo } = req
        const myId = mongoose.Types.ObjectId()
        
        const newComment = {
            _id: myId,
            postId: data.postId,
            content: data.content,
            user: userInfo._id
        }

        const newCommentIns = new CommentModel(newComment)

        newCommentIns.save(err => {
            if (err === null) {
                PostModel
                    .updateOne(
                        {
                            _id: data.postId
                        },
                        {
                            $push: {
                                comment: { _id: myId }
                            }
                        }
                    )
                    .then(updateRes => {
                        if (updateRes) {
                            res.json({
                                status: true,
                                newCommentId: myId,
                                message: 'Comment thanh cong'
                            })
                        } else {
                            req.err = 'khong the luu comment'
                            next('last')
                        }
                    })

            } else {
                req.err = 'khong the luu comment'
                next('last')
            }
        })
    }

    deleteComment = (req, res, next) => {
        const { userInfo } = req
        const { commentId, postId, userId } = req.query
        const { role } = userInfo

        if (role === 'admin' || userId === userInfo._id) {
            CommentModel.deleteOne({
                _id: commentId
            })
                .then(resData => {
                    if(resData) {
                        PostModel.updateOne(
                            {
                                _id: postId
                            },
                            {
                                $pull: {
                                    comment: { _id: mongoose.Types.ObjectId(commentId) }
                                }
                            })
                            .then(resData2 => {
                                console.log(resData2)
                                res.json({
                                    status: true,
                                    message: 'thanh cong',
                                })
                            })
                            .catch(err => {
                                req.err = 'ServerErr(437_Post)'
                                next('last')
                            })
                    }
                })
        } else {
            req.err = 'NotAllowed(441_Post)'
            next('last')
        }
    }

    like = (req, res, next) => {
        const { postId } = req.params
        const { userInfo } = req

        const newLike = {
            _id: userInfo._id
        }

        PostModel.updateOne(
            {
                _id: postId
            },
            {
                $push: {
                    like: newLike
                }
            })
            .then(resData => {
                if (resData) {
                    res.json({
                        status: true,
                        message: 'liked'
                    })
                } else {
                    req.err = 'loi like'
                    next('last')
                }
            })
            .catch(err => {
                req.err = 'loi like'
                next('last')
            })
    }

    unlike = (req, res, next) => {
        const { postId } = req.params
        const { userInfo } = req

        const _id = userInfo._id

        PostModel.updateOne(
            {
                _id: postId
            },
            {
                $pull: {
                    like: { _id: _id }
                }
            })
            .then(resData => {
                if (resData) {
                    res.json({
                        status: true,
                        message: 'unliked'
                    })
                } else {
                    req.err = 'loi like'
                    next('last')
                }
            })
            .catch(err => {
                req.err = 'loi like'
                next('last')
            })
    }

    filter = (req, res, next) => {
        const { category, author } = req.query

        const query = {}

        if (category) {
            query.category = category
        }
        if (author) {
            query.author = author
        }

        PostModel.find(query)
            .populate('category')
            .populate('author', 'firstName lastName image _id')
            .then((resData) => {
                if (resData && resData.length > 0) {
                    res.json({
                        status: true,
                        relatedPost: resData
                    })
                } else {
                    req.err = 'khong tim thay post'
                    next('last')
                }
            })
            .catch(err => {
                req.err = 'dang co loi'
                next('last')
            })
    }

}

const postController = new PostController()

module.exports = postController
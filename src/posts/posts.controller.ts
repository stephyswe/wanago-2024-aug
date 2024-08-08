
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import PostsService from './posts.service';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import FindOneParams from '../utils/FindOneParams';
import RequestWithUser from '../authentication/requestWithUser.interface';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import { PaginationParams } from '../utils/types/paginationParams';
 
@Controller('posts')
export default class PostsController {
  constructor(
    private readonly postsService: PostsService
  ) {}
 
  @Get()
  async getPosts(
    @Query('search') search: string,
    @Query() { offset, limit }: PaginationParams
  ) {
    if (search) {
      return;
      //return this.postsService.searchForPosts(search, offset, limit);
    }
    return this.postsService.getAllPosts(offset, limit);
  }
 
  @Get(':id')
  getPostById(@Param() { id }: FindOneParams) {
    return this.postsService.getPostById(Number(id));
  }
  
  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createPost(@Body() post: CreatePostDto, @Req() req: RequestWithUser) {
    return this.postsService.createPost(post, req.user);
  }
 
  @Put(':id')
  async updatePost(@Param() { id }: FindOneParams, @Body() post: UpdatePostDto) {
    return this.postsService.updatePost(Number(id), post);
  }
 
  @Delete(':id')
  async deletePost(@Param() { id }: FindOneParams) {
    this.postsService.deletePost(Number(id));
  }
}
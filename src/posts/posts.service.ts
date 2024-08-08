import { ClassSerializerInterceptor, Injectable, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, MoreThan, Repository } from 'typeorm';

import PostEntity from './post.entity';
import User from '../users/user.entity';
import { UpdatePostDto } from './dto/updatePost.dto';
import { CreatePostDto } from './dto/createPost.dto';
import PostNotFoundException from './exceptions/postNotFound.exception';
import PostsSearchService from './postsSearch.service';

@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
export default class PostsService {

  constructor(
    @InjectRepository(PostEntity)
    private postsRepository: Repository<PostEntity>,
    private postsSearchService: PostsSearchService
  ) {
  }

  async getAllPosts(offset?: number, limit?: number, startId?: number) {
    const where: FindManyOptions<PostEntity>['where'] = {};
    let separateCount = 0;
    if (startId) {
      where.id = MoreThan(startId);
      separateCount = await this.postsRepository.count();
    }

    const [items, count] = await this.postsRepository.findAndCount({
      where,
      relations: ['author'],
      order: {
        id: 'ASC'
      },
      skip: offset,
      take: limit
    });

    return {
      items,
      count: startId ? separateCount : count
    }
  }

  async getPostById(id: number) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (post) {
      return post;
    }
    throw new PostNotFoundException(id);
  }

  async createPost(post: CreatePostDto, user: User) {
    const newPost = this.postsRepository.create({
      ...post,
      author: user
    });
    await this.postsRepository.save(newPost);
    //this.postsSearchService.indexPost(newPost);
    return newPost;
  }

  async updatePost(id: number, post: UpdatePostDto) {
    const foundPost = await this.postsRepository.findOne({
      where: { id },
      relations: ['author'],
    });
  
    if (!foundPost) {
      throw new PostNotFoundException(id);
    }
  
    // Update the found post with the new values
    Object.assign(foundPost, post);
  
    await this.postsRepository.save(foundPost);
    //await this.postsSearchService.update(foundPost);
  }
  
  async deletePost(id: number) {
    const deleteResponse = await this.postsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new PostNotFoundException(id);
    }
  }

  /*async searchForPosts(text: string, offset?: number, limit?: number) {
    const results = await this.postsSearchService.search(text);
    const ids = results.map(result => result.id);
    if (!ids.length) {
      return [];
    }
    return this.postsRepository
      .find({
        where: { id: In(ids) }
      });
  }*/
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import PostEntity from './post.entity';
import { UpdatePostDto } from './dto/updatePost.dto';
import { CreatePostDto } from './dto/createPost.dto';
import PostNotFoundException from './exceptions/postNotFound.exception';

@Injectable()
export default class PostsService {

  constructor(
    @InjectRepository(PostEntity)
    private postsRepository: Repository<PostEntity>,
  ) {
  }

  getAllPosts() {
    return this.postsRepository.find();
  }

  async getPostById(id: number) {
    const post = await this.postsRepository.findOneBy({id});
    if (post) {
      return post;
    }
    throw new PostNotFoundException(id);
  }

    async createPost(post: CreatePostDto) {
      const newPost = await this.postsRepository.create(post);
      await this.postsRepository.save(newPost);
      return newPost;
    }

  async updatePost(id: number, post: UpdatePostDto) {
    const foundPost = await this.postsRepository.findOneBy({ id });
    if (!foundPost) {
      throw new PostNotFoundException(id);
    }
    await this.postsRepository.update(id, post);
    return this.postsRepository.findOneByOrFail({ id });
  }
  
  async deletePost(id: number) {
    const deleteResponse = await this.postsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new PostNotFoundException(id);
    }
  }
}
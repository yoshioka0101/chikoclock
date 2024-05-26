class V1::PostsController < ApplicationController
    before_action :set_post, only: %i[show destroy update]

    def index
        posts = Post.all.order(:id)
        render json: posts
    end

    def show
        render json: @post
    end

    def create
        post = Post.new(post_params)
        if post.save
            render json: post, status: :created
        else
            render json: post.errors, status: :unprocessable_entity
        end
    end

    def update
        if @post.update(post_params)
            render json: @post
        else
            render json: @post.errors
        end
    end

    def destroy
        if @post.destroy
            render json: @post
        else
            render json: @post.errors
        end
    end

    private

    def set_post
        @post = Post.find(params[:id])
    end

    def post_params
        params.require(:post).permit(:title, :content, :date, :time, :location)
    end
end
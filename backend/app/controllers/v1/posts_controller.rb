class V1::PostsController < ApplicationController
  before_action :set_post, only: %i[show destroy update]
  before_action :authenticate_v1_user!

  def index
    posts = current_v1_user.posts.order(:id) # ログイン中のユーザーの投稿を取得
    render json: posts
  end

  def show
    render json: @post
  end

  def create
    @post = current_v1_user.posts.build(post_params) # 投稿をログイン中のユーザーに関連付ける
    if @post.save
      render json: @post, status: :created
    else
      render json: @post.errors, status: :unprocessable_entity
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
    @post = current_v1_user.posts.find(params[:id]) # ログイン中のユーザーの投稿に限定
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Post not found" }, status: :not_found
  end

  def post_params
    params.require(:post).permit(:title, :content, :date, :time, :location)
  end
end
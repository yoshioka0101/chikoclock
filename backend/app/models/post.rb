class Post < ApplicationRecord
  belongs_to :user
  before_create :generate_unique_hash_string

  private

  def generate_unique_hash_string
    loop do
      self.hash_string = SecureRandom.hex(10)
      break unless Post.exists?(hash_string: hash_string)
    end
  end
end
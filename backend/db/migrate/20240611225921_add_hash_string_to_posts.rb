class AddHashStringToPosts < ActiveRecord::Migration[7.0]
  def change
    add_column :posts, :hash_string, :string
  end
end

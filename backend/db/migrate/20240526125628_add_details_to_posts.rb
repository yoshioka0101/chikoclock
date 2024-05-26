class AddDetailsToPosts < ActiveRecord::Migration[7.0]
  def change
    add_column :posts, :date, :date
    add_column :posts, :time, :time
    add_column :posts, :location, :string
  end
end

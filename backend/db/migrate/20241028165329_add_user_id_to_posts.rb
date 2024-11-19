class AddUserIdToPosts < ActiveRecord::Migration[7.0]
  def change
    add_reference :posts, :user, foreign_key: true, null: true

    # 必要に応じて既存のデータに user_id を設定（ここでは仮に1に設定）
    reversible do |dir|
      dir.up do
        execute <<-SQL.squish
          UPDATE posts SET user_id = 1 WHERE user_id IS NULL
        SQL
      end
    end

    change_column_null :posts, :user_id, false
  end
end

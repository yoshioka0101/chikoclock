# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

Post.create([
  { title: 'First Post', content: 'This is the first post content', date: '2023-05-24', time: '12:00', location: 'Tokyo Tower', created_at: Time.now, updated_at: Time.now },
  { title: 'Second Post', content: 'This is the second post content', date: '2023-05-25', time: '13:00', location: 'Tokyo Dome', created_at: Time.now, updated_at: Time.now },
  { title: 'Third Post', content: 'This is the third post content', date: '2023-05-26', time: '14:00', location: 'Shibuya Crossing', created_at: Time.now, updated_at: Time.now }
])

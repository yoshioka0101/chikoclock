class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable

  include DeviseTokenAuth::Concerns::User

  validates :email, presence: true, uniqueness: { scope: :provider }
  validates :password, presence: true, length: { minimum: 6 }
  validates :uid, presence: true

  before_validation :set_uid

  private

  def set_uid
    self.uid ||= email if provider == "email"
  end
end

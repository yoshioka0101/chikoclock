# app/controllers/auth/registrations_controller.rb
class Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController
  def create
    @resource = resource_class.new(sign_up_params.except(:confirm_success_url))

    # Set provider to email and uid to the email value
    @resource.provider = "email"
    @resource.uid = sign_up_params[:email]

    if @resource.save
      render json: { status: 'success', data: @resource }, status: :ok
    else
      render json: { status: 'error', data: @resource.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def sign_up_params
    params.permit(:email, :password, :password_confirmation, :confirm_success_url)
  end
end

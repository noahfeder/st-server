require 'sinatra'

get "/" do
  # erb :index
  "Hi"
end
get "/:top/:bottom" do
  @top = params[:top]
  @bottom = params[:bottom]
  erb :index
end
get "/:garbage" do
  erb :index
end


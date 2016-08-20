require 'sinatra'
require 'screencap'

get "/" do
  erb :index
end
get "/:top/:bottom" do
  @top = params[:top]
  @bottom = params[:bottom]
  erb :index
end
get "/:top/:bottom/print" do
  @top = params[:top]
  @bottom = params[:bottom]
  f = Screencap::Fetcher.new('/#{@top}/#{@bottom}')
  screenshot = f.fetch(
    :output => '/cap.png',
    :div => '.wrapper'
    )
end
get "/:garbage" do
  erb :index
end


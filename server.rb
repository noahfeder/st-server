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
  f = Screencap::Fetcher.new('http://localhost:9292/#{@top}/#{@bottom}')
  screenshot = f.fetch(
    :output => '/cap.png',
    :div => '.wrapper'
    )
  screenshot
end
get "/:garbage" do
  erb :index
end


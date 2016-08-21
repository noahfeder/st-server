require 'sinatra'
#require 'dotenv'

#Dotenv.load

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
  redirect to("https://phantomjscloud.com/api/browser/v2/#{ENV['KEY']}/?request={url:%22https://st-text.herokuapp.com/#{@top}/#{@bottom}%22,renderType:%22png%22,requestSettings:{waitInterval:4000},renderSettings:{viewport:{height:350,width:750},clipRectangle:{height:230,width:750,top:0,left:0}}}")
end
get "/:garbage" do
  erb :index
end


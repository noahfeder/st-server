require 'sinatra'
require 'dotenv'

Dotenv.load

get "/" do
  erb :index
end
get "/:top/:bottom" do
  @top = params[:top]
  @bottom = params[:bottom]
  @top_length = @top.length * 85
  @bottom_length = @bottom.length * 72
  def is_first_longer?
    @top_length > @bottom_length
  end
  @top_line = {
    :width => @top_length,
    :left => (750 - @top_length) / 2,
    :top => 84.5
  }
  @left_line = {
    :width => (@top_length - @bottom_length) / 2,
    :left => (750 - @top_length) / 2,
    :top => 200.75
  }
  @right_line = {
    :width => (@top_length - @bottom_length) / 2,
    :left => @bottom_length + @left_line[:width] + ((750 - @top_length) / 2),
    :top => 200.75
  }
  @right_line[:top] = 227.5 if is_first_longer?
  @left_line[:top] = 227.5 if is_first_longer?
  @left_line[:width] = -1 * @left_line[:width] if @left_line[:width] < 0
  @right_line[:width] = -1 * @right_line[:width] if @right_line[:width] < 0
  @left_line[:left] = (750 - @bottom_length) / 2 if !is_first_longer?
  @right_line[:left] = @top_length + @left_line[:width] + ((750 - @bottom_length) / 2) if !is_first_longer?
  @left_line[:width] = 0 if @left_line[:width] < 20
  @right_line[:width] = 0 if @right_line[:width] < 20
  erb :show
end
get "/:top/:bottom/print" do
  @top = params[:top]
  @bottom = params[:bottom]
  redirect to("https://phantomjscloud.com/api/browser/v2/#{ENV['KEY']}/?request={url:%22https://st-text.herokuapp.com/#{@top}/#{@bottom}%22,renderType:%22png%22,renderSettings:{viewport:{height:400,width:750},clipRectangle:{height:400,width:750,top:0,left:0}}}")
end
get "/:garbage" do
  erb :index
end


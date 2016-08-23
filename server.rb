require 'sinatra'
require 'dotenv'

Dotenv.load

letters = {a: 84, b: 76, c: 77, d: 82, e: 71, f: 65,
  g: 86, h: 80, i: 35, j: 67, k: 85, l: 65, m: 87, n: 72, o: 82, p: 72,
  q: 87, r: 83, s: 67, t: 70, u: 76, v: 77, w: 107, x: 82, y: 78, z: 71}

get "/" do
  erb :index
end
get "/:top/:bottom/static" do
  @top = params[:top] #stranger
  @bottom = params[:bottom]
  @top_length = 0
  @bottom_length = 0
  @top.split('').each_with_index do |letter,index|
    if (index == 0 || index == (@top.length - 1))
      @top_length += (letters[letter.to_sym] * 1.3)
    else
      @top_length += letters[letter.to_sym]
    end
  end
  @bottom.split('').each_with_index do |letter,index|
    if (index == 0 || index == (@bottom.length - 1))
      @bottom_length += (letters[letter.to_sym] * 1.3)
    else
      @bottom_length += letters[letter.to_sym]
    end
  end
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
  redirect to("https://phantomjscloud.com/api/browser/v2/#{ENV['KEY']}/?request={url:%22https://st-text.herokuapp.com/#{@top}/#{@bottom}/static%22,renderType:%22png%22,renderSettings:{viewport:{height:400,width:750},clipRectangle:{height:400,width:750,top:0,left:0}}}")
end
get "/:garbage" do
  erb :index
end


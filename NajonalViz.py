import pandas as pd
import numpy as np
from datetime import datetime as dt
from bokeh.plotting import figure, output_file, show, ColumnDataSource
from bokeh.models import Range1d, HoverTool, Span

# import polls

AvgDf = pd.read_csv('pollsters/avgPolling.csv', delimiter=';', index_col=['Date'], parse_dates=['Date'])
source= ColumnDataSource(AvgDf)

#There's got to be a better way to do this!
InFact =   pd.read_csv('pollsters/InFact.csv',   delimiter=';', index_col=['Date'], parse_dates=['Date'])
Norfakta = pd.read_csv('pollsters/Norfakta.csv', delimiter=';', index_col=['Date'], parse_dates=['Date'])
Norstat =  pd.read_csv('pollsters/Norstat.csv',  delimiter=';', index_col=['Date'], parse_dates=['Date'])
Opinion =  pd.read_csv('pollsters/Opinion.csv',  delimiter=';', index_col=['Date'], parse_dates=['Date'])
Respons =  pd.read_csv('pollsters/Respons.csv',  delimiter=';', index_col=['Date'], parse_dates=['Date'])
TNS =      pd.read_csv('pollsters/TNS.csv',      delimiter=';', index_col=['Date'], parse_dates=['Date'])
Sentio =   pd.read_csv('pollsters/Sentio.csv',   delimiter=';', index_col=['Date'], parse_dates=['Date'])
Ipsos =    pd.read_csv('pollsters/Ipsos.csv',    delimiter=';', index_col=['Date'], parse_dates=['Date'])

# Convert date boundries to floats
startDate = dt(2016,12,31).timestamp()*1000
endDate = dt(2017,10,1).timestamp()*1000
electionDay = dt(2017,9,11).timestamp()*1000
dataStart = dt(2010,1,1).timestamp()*1000

# List parties or something
Parties = ["Rodt", "SV", "Ap", "Sp", "MDG", "KrF", "Venstre", "Hoyre", "Frp"]
# Parties = ['Ap', 'Hoyre', 'Frp', 'SV', 'Sp', 'KrF', 'Venstre', 'MDG', 'Rodt', 'Andre']
PartyColors = {'Ap':'#F02844', 'Hoyre':'#34A4E2', 'Frp':'#2B4AAF', 'SV':'#F962D9', 'Sp':'#7D8000', 'KrF':'#FFBD0E', 'Venstre':'#00663C', 'MDG':'#52BC25', 'Rodt':'#9E0037', 'Andre':'#424451'}


# ##### DEFINE PLOT #####
p = figure(plot_width = 500, plot_height = 250, x_axis_type = "datetime",
           tools = "xpan,xwheel_zoom,hover", toolbar_location = None,
           active_scroll = "xwheel_zoom",
           background_fill_color="#EEEEEE")

# Starting range and bounds
p.x_range = Range1d(start=startDate, end=endDate, bounds=(dataStart, None))
p.y_range = Range1d(start=0, end=45.1, bounds=None)

# Hover tool:
# ideally this should go in a static legend to the side or below the plot and
# have a vertical line annotation following the cursor ... #TODO i guess
p.line('Date', 40, source=source, name='hoverref', line_color=None, line_alpha=0)
p.select_one(HoverTool).mode = 'vline'
p.select_one(HoverTool).names = ['hoverref']
p.select_one(HoverTool).tooltips = '''
<style>
    span {padding: 0px 5px;}
</style>

<div>
    <span style="color: ''' +PartyColors['Ap']+ '''">Ap: @Ap{1.1}</span>
    <span style="color: ''' +PartyColors['Hoyre']+ '''">Høyre: @Hoyre{1.1}</span>
    <span style="color: ''' +PartyColors['Frp']+ '''">Frp: @Frp{1.1}</span>
    <span style="color: ''' +PartyColors['Sp']+ '''">Sp: @Sp{1.1}</span>
    <span style="color: ''' +PartyColors['KrF']+ '''">KrF: @KrF{1.1}</span>
    <br>
    <span style="color: ''' +PartyColors['SV']+ '''">SV: @SV{1.1}</span>
    <span style="color: ''' +PartyColors['MDG']+ '''">MDG: @MDG{1.1}</span>
    <span style="color: ''' +PartyColors['Venstre']+ '''">Venstre: @Venstre{1.1}</span>
    <span style="color: ''' +PartyColors['Rodt']+ '''">Rødt: @Rodt{1.1}</span>
    
</div>
'''
#     <span style="color: ''' +PartyColors['Andre']+ '''">Andre: @Andre{1.1}</span>

# ------------------------------------------------------------
# Make the html list parties based on whom has better polling!
# ------------------------------------------------------------


# Title and title styling
p.title.text = "Stortingsvalg 2017"
p.title.align = "center"
p.title.text_font = 'verdana'
p.title.text_font_size = "1.2em"
p.title.text_color = "#666666"

# Axis and grid stylings
p.yaxis.axis_line_width = 2
p.yaxis.axis_line_color = "#E5E5E5"
p.yaxis.major_tick_line_color = None

p.xaxis.axis_line_width = 2.5
p.xaxis.major_tick_line_width = 2

p.axis.minor_tick_line_color = None
p.axis.major_tick_line_cap = 'butt'
p.axis.major_label_text_font = 'verdana'
p.axis.major_label_text_font_size = "0.8em"
p.axis.major_label_text_color = "#666666"
p.axis.major_tick_in = -1

p.grid.grid_line_width = 2
p.grid.grid_line_color = "#E5E5E5"

p.min_border = 60
p.border_fill_color = "#EEEEEE"

# ##### -- #####

# Dot Styling function
def drawCircle(root, poller, party):
    root.circle(poller.index, np.array(getattr(poller, party)),
                line_color=PartyColors[party], fill_color=PartyColors[party], fill_alpha=0.4,
                line_alpha=0, line_width=1, size=6)
    return None


# Draw lines and points
# For all the parties, plot datapoints and average line
# Individual datapoints:
for i in range(0,len(Parties)):
    drawCircle(p, InFact,   Parties[i])
    drawCircle(p, Norfakta, Parties[i])
    drawCircle(p, Norstat,  Parties[i])   
    drawCircle(p, Opinion,  Parties[i])
    drawCircle(p, Respons,  Parties[i])
    drawCircle(p, TNS,      Parties[i])
    drawCircle(p, Sentio,   Parties[i])
    drawCircle(p, Ipsos,    Parties[i])
    
# Plot our running average:
for i in range(0,len(Parties)):
    p.line(AvgDf.index, np.array(getattr(AvgDf, Parties[i])), line_color=PartyColors[Parties[i]], line_width=2.5)
    

# Election day annotation
electionAnnotation = Span(location=electionDay, dimension='height', line_width=2.5, line_color='#999999', line_dash='dashed')
p.add_layout(electionAnnotation)

output_file('test.html')
show(p)
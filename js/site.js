function hxlProxyToJSON(input,headers){
    var output = [];
    var keys=[]
    input.forEach(function(e,i){
        if(i==0){
            e.forEach(function(e2,i2){
                var parts = e2.split('+');
                var key = parts[0]
                if(parts.length>1){
                    var atts = parts.splice(1,parts.length);
                    atts.sort();
                    atts.forEach(function(att){
                        key +='+'+att
                    });
                }
                keys.push(key);
            });
        } else {
            var row = {};
            e.forEach(function(e2,i2){
                row[keys[i2]] = e2;
            });
            output.push(row);
        }
    });
    return output;
}

function niceFormatNumber(num,round){
    if(isNaN(parseFloat(num))){
        return num;
    } else {
        if(!round){
            var format = d3.format("0,000");
            return format(parseFloat(num));
        } else {
            var output = d3.format(".4s")(parseFloat(num));
            if(output.slice(-1)=='k'){
                output = Math.round(output.slice(0, -1) * 1000);
                output = d3.format("0,000")(output);
            } else if(output.slice(-1)=='M'){
                output = d3.format(".1f")(output.slice(0, -1))+' million';
            } else if (output.slice(-1) == 'G') {
                output = output.slice(0, -1) + ' billion';
            } else {
                output = ''+d3.format(".3s")(parseFloat(num));
            }
            return output;
        }
    }
}

function loadKeyFigures(url){
    var hxlurl = 'https://proxy.hxlstandard.org/data.json?strip-headers=on&url='+url;
    $.ajax({
            type: 'GET',
            url: hxlurl,
            dataType: 'json',
            success: function(result){
                var data = hxlProxyToJSON(result);
                var html = '<div class="column small-up-2 medium-up-2"><h3>Key Figures</h3>';
                data.forEach(function(d){
                    html+='<div class="column"><div class="card no-border"><h4 class="keyfiguretitle text-center minheight">'+d['#meta+title']+'</h4><p class="keyfigure text-center">'+niceFormatNumber(d['#indicator'])+'</p><p class="small text-center">Source: <a href="'+d['#meta+url']+'" target="_blank">'+d['#meta+source']+'</a></p></div></div>'
                });
                html+='</div>'; //closing div for KF
                $('#keyfigures').html(html);
            }
    });
}

function appealPlusLinks(appeals){
    appeals.forEach(function(a){
        $('#appealplus').append('<a href="http://ifrcgo.org/appeals/'+a.toLowerCase()+'">http://ifrcgo.org/appeals/'+a.toLowerCase()+'/</a><br />');
    });
}

var appeals = ['MDRET016','MDRSO005','MDRKE039'];
var hxlAppealString = '';
appeals.forEach(function(appeal,i){
    hxlAppealString+= '&select-query02-0'+(i+1)+'=%23meta%2Bid%3D'+appeal;
});
console.log(hxlAppealString);
var hxlAppealsCallURL = 'https://proxy.hxlstandard.org/data.json?merge-tags03=%23meta%2Bcoverage%2C%23meta%2Bfunding&filter04=replace-map&replace-map-url04=https%3A//docs.google.com/spreadsheets/d/1hTE0U3V8x18homc5KxfA7IIrv1Y9F1oulhJt0Z4z3zo/edit%3Fusp%3Dsharing&merge-keys05=%23country%2Bname&filter03=merge&url=https%3A//docs.google.com/spreadsheets/d/19pBx2NpbgcLFeWoJGdCqECT2kw9O9_WmcZ3O41Sj4hU/edit%23gid%3D0&merge-url05=https%3A//docs.google.com/spreadsheets/d/1GugpfyzridvfezFcDsl6dNlpZDqI8TQJw-Jx52obny8/edit%3Fusp%3Dsharing&merge-keys03=%23meta%2Bid&filter02=select&filter01=clean&strip-headers=on&clean-date-tags01=%23date&force=on&merge-url03=https%3A//docs.google.com/spreadsheets/d/1rVAE8b3uC_XIqU-eapUGLU7orIzYSUmvlPm9tI0bCbU/edit%23gid%3D0&filter05=merge&merge-tags05=%23country%2Bcode'+hxlAppealString;
console.log(hxlAppealsCallURL);
var hxlDocumentsCallURL = 'https://proxy.hxlstandard.org/data.json?filter02=select&strip-headers=on&url=https%3A//docs.google.com/spreadsheets/d/1gJ4N_PYBqtwVuJ10d8zXWxQle_i84vDx5dHNBomYWdU/edit%3Fusp%3Dsharing'+hxlAppealString;

$.ajax({
    type: 'GET',
    url: hxlAppealsCallURL,
    dataType: 'json',
    success:function(response){
        // could use to make map highlight countries
        console.log(response);
        $('#overview').append(JSON.stringify(hxlProxyToJSON(response)));
    }
});

$.ajax({
    type: 'GET',
    url: hxlDocumentsCallURL,
    dataType: 'json',
    success:function(response){
        // could use to make map highlight countries
        console.log(response);
        $('#documents').append(JSON.stringify(hxlProxyToJSON(response)));
    }
});

//example key figures running off a spreadsheet.
loadKeyFigures('https://docs.google.com/spreadsheets/d/1PwKRHEDkqUfmGDeyLrYwWhO50yfnh2ZHtIyn9W0zgdw/edit?usp=sharing');
appealPlusLinks(appeals);

/*
Here is a few suggestions:
Maps of countries with open operations.
Overview of:
DREF and Emergency Appeals launched in the four countries
Funding level
Links to relevant appeal documents
Global tools deployed
Operational teams in place
Public documents (joint statement, press release)
Links to appeal plus pages for each operation
*/
<?php

class GridPage extends Page
{

	public static $icon = 'gridpage/images/icons/grid.png';
	public static $description = 'Display content in rows and columns';
	public static $singular_name = "Grid page";
	public static $plural_name = "Grid pages";

    public static $db = array(
        'GridContent' => 'Text'
    );

    public function getCMSFields()
    {
        //css
        Requirements::css('gridpage/javascript/grideditor/bootstrap.css');
        Requirements::css('gridpage/javascript/grideditor/themes/silverstripe/grideditor.css');
        //javascript
        Requirements::javascript('gridpage/javascript/grideditor/json2.js');
        Requirements::javascript('gridpage/javascript/grideditor/gridEditor.js');
        Requirements::javascript('gridpage/javascript/gridpage.js');
        //fields
        SiteTree::disableCMSFieldsExtensions();
        $fields = parent::getCMSFields();
        SiteTree::enableCMSFieldsExtensions();

        $fields->removeByName('Content');
        $css_classes = json_encode(self::config()->css_columnclasses);
        $fields->addFieldToTab('Root.Main', new LiteralField('grideditorholder', '<div id="grideditorholder" data-css-classes="'.Convert::raw2xml($css_classes).'"></div>'), 'Metadata');
        $fields->addFieldToTab('Root.Main', new HiddenField('GridContent'));

        $this->extend('updateCMSFields', $fields);
        return $fields;
    }

    public function onBeforeWrite()
    {
        $this->Content = $this->GenerateContent();
        parent::onBeforeWrite();
    }

    private function renderRow($data){
		$row_class = self::config()->css_rowclass;
		$row_class = $row_class ? $row_class : 'row';
		$output = '<div class="'.$row_class.'">';
		foreach($data->columns as $column){
			$output .= $this->renderColumn($column);
		}
		$output .= '</div>';
		return $output;
    }

    private function renderColumn($data){
		$css_classes = self::config()->css_columnclasses;
		$css_class = (isset($css_classes[$data->columnname]) ? $css_classes[$data->columnname]['class'] : $data->class);
		if ($data->extraclass) {
			$css_class .= " ".$data->extraclass;
		}
		$output = '<div class="' . $css_class . '"><div class="column-inner">';
		$output .= $data->content;
		foreach($data->rows as $row){
			$output .= $this->renderRow($row);
		}
		$output .= '</div></div>';
		return $output;
    }

    public function GenerateContent(){
        if(!$this->GridContent){
            return '';
        }
        $json = json_decode($this->GridContent);
        $output = '<div class="grid">';
        foreach($json->rows as $row){
            $output .= $this->renderRow($row);
        }
        $output .= '</div>';
        return $output;
    }

}

class GridPage_Controller extends Page_Controller
{
}
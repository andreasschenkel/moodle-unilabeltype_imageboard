<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * unilabel type imageboard
 *
 * @package     unilabeltype_imageboard
 * @author      Andreas Grabs <info@grabs-edv.de>
 * @author      Andreas Schenkel
 * @copyright   2018 onwards Grabs EDV {@link https://www.grabs-edv.de}
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * Backup definition for this content type
 * @package     unilabeltype_imageboard
 * @author      Andreas Grabs <info@grabs-edv.de>
 * @author      Andreas Schenkel
 * @copyright   2018 onwards Grabs EDV {@link https://www.grabs-edv.de}
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class backup_unilabeltype_imageboard_subplugin extends backup_subplugin {

    /**
     * Returns the assessment form definition to attach to 'unilabel' XML element
     * @return \backup_subplugin_element
     */
    protected function define_unilabel_subplugin_structure() {

        // XML nodes declaration.
        $subplugin = $this->get_subplugin_element();
        $subpluginwrapper = new backup_nested_element($this->get_recommended_name());
        $subpluginimageboard = new backup_nested_element('unilabeltype_imageboard',
            array('id'),
            array('showintro', 'canvaswidth', 'canvasheight')
        );
        $subplugintile = new backup_nested_element('unilabeltype_imageboard_tile',
            array('id'),
            array('title', 'url', 'xposition', 'yposition', 'targetwidth', 'targetheight', 'border')
        );

        // Connect XML elements into the tree.
        $subplugin->add_child($subpluginwrapper);
        $subpluginwrapper->add_child($subpluginimageboard);
        $subpluginimageboard->add_child($subplugintile);

        // Set source to populate the data.
        $subpluginimageboard->set_source_table('unilabeltype_imageboard', array('unilabelid' => backup::VAR_ACTIVITYID));
        $subplugintile->set_source_table('unilabeltype_imageboard_tile', array('imageboardid' => backup::VAR_PARENTID));

        // File annotations.
        $subpluginimageboard->annotate_files('unilabeltype_imageboard', 'backgroundimage', null);
        $subplugintile->annotate_files('unilabeltype_imageboard', 'image', 'id');

        return $subplugin;
    }
}
